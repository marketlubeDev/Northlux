const mongoose = require("mongoose");
const AppError = require("../utilities/errorHandlings/appError");
const orderModel = require("../model/orderModel");
const productModel = require("../model/productModel");
const catchAsync = require("../utilities/errorHandlings/catchAsync");
const { getOrderStats } = require("../helpers/aggregation/aggregations");

//     const userId = req.user
//     const { products, address, paymentMethod, transactionId } = req.body
//     if (!products) {
//         return next(new AppError("All fields are required", 400))
//     }
//     const productIds = products.map(p => new mongoose.Types.ObjectId(p.productId));
//     const productDetails = await productModel.aggregate([
//         { $match: { _id: { $in: productIds } } },
//         {
//             $project: {
//                 name: 1,
//                 offerPrice: 1,
//                 stock: 1,
//             }
//         }
//     ]);

//     if (productDetails.length !== products.length) return next(new AppError("Invalid product selection", 400));

//     let totalAmount = 0;
//     const orderProducts = [];

//     const bulkOperations = productDetails.map(product => {
//         const item = products.find(p => p.productId === product._id.toString());

//         if (!item) next(new AppError(`Product not found: ${product._id}`));
//         if (product.quantity < item.quantity) next(new AppError(`Insufficient stock for ${product.name}`));

//         totalAmount += product.offerPrice * item.quantity;
//         orderProducts.push({ productId: product._id, quantity: item.quantity, price: product.offerPrice });

//         // Reduce stock using bulk update
//         return {
//             updateOne: {
//                 filter: { _id: product._id },
//                 update: { $inc: { stock: -item.quantity } }
//             }
//         };
//     });

//     // Perform bulk stock update
//     await productModel.bulkWrite(bulkOperations);

//     const newOrder = new orderModel({
//         userId,
//         products: orderProducts,
//         // address,
//         totalAmount,
//         // paymentDetails: {
//         //     method: paymentMethod,
//         //     status: paymentMethod === "cod" ? "pending" : "completed",
//         // }
//     })

//     const orderPlaced = await newOrder.save()

//     res.status(201).json({ message: "Order Placed", orderPlaced })

// });

const placeOrder = catchAsync(async (req, res, next) => {
  console.log(req.body, "req.body");
  const { productId, variantId, quantity } = req.body;

  if (!mongoose.isValidObjectId(productId)) {
    return next(new AppError("Invalid product ID", 400));
  }

  // Get the current date components
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2); // Last 2 digits of year
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  // Get count of orders for today to create sequence
  const todayStart = new Date(date.setHours(0, 0, 0, 0));
  const todayEnd = new Date(date.setHours(23, 59, 59, 999));

  const orderCount = await orderModel.countDocuments({
    createdAt: {
      $gte: todayStart,
      $lte: todayEnd,
    },
  });

  const sequence = (orderCount + 1).toString().padStart(4, "0");

  const aggregationPipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(productId),
      },
    },
    {
      $lookup: {
        from: "stores",
        localField: "store",
        foreignField: "_id",
        as: "store",
      },
    },
    {
      $lookup: {
        from: "variants",
        let: { variantIds: "$variants" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ["$_id", "$$variantIds"] },
                  variantId
                    ? { $eq: ["$_id", new mongoose.Types.ObjectId(variantId)] }
                    : { $expr: true },
                ],
              },
            },
          },
        ],
        as: "variants",
      },
    },
    {
      $project: {
        name: 1,
        offerPrice: 1,
        images: {
          $cond: {
            if: { $gt: [{ $size: "$variants" }, 0] },
            then: { $first: "$variants.images" },
            else: "$images",
          },
        },
        store: { $arrayElemAt: ["$store", 0] },
        variants: 1,
      },
    },
  ];

  const [product] = await productModel.aggregate(aggregationPipeline);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (variantId && (!product.variants || product.variants.length === 0)) {
    return next(new AppError("Variant not found", 404));
  }

  const finalPrice = product.variants?.[0]?.offerPrice || product.offerPrice;
  const totalAmount = finalPrice * quantity;

  // Create order ID: STORENAME-YYMMDD-SEQUENCE
  // Example: NORTHLUX-230901-0001
  const storeName = (product.store?.store_name || "Northlux")
    .toUpperCase()
    .replace(/\s+/g, "");
  const orderId = `${storeName}${year}${month}${day}${sequence}`;

  console.log(orderId, "orderId");

  const newOrder = new orderModel({
    orderId,
    product: product._id,
    variant: variantId,
    quantity,
    totalAmount,
  });

  await newOrder.save();

  res.status(200).json({
    status: "success",
    data: {
      order: {
        orderId,
        productName: product.name,
        productImage: product.images[0],
        variantName: product.variants?.[0]?.attributes?.title || null,
        quantity,
        pricePerUnit: finalPrice,
        totalAmount,
        storeName: product.store?.store_name,
        storeNumber: product.store?.store_number,
      },
    },
  });
});

const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const { status, type } = req.body;

  const validStatuses = {
    order: [
      "pending",
      "processed",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
      "onrefund",
    ],
    payment: ["pending", "paid", "failed", "refunded", "onrefund"],
  };

  if (!type || !["order", "payment"].includes(type)) {
    return next(
      new AppError("Invalid status type. Must be 'order' or 'payment'.", 400)
    );
  }

  if (!validStatuses[type].includes(status)) {
    return next(
      new AppError(
        `Invalid ${type} status provided. Valid statuses are: ${validStatuses[
          type
        ].join(", ")}`,
        400
      )
    );
  }

  const updateField = type === "order" ? { status } : { paymentStatus: status };

  const updatedOrder = await orderModel
    .findByIdAndUpdate(orderId, updateField, { new: true })
    .populate({
      path: "products.productId",
      select: "name images price category",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .populate("user", "username phonenumber address");

  if (!updatedOrder) {
    return next(new AppError("Order not found.", 404));
  }

  return res.status(200).json({
    success: true,
    message: `Order ${type} status updated successfully.`,
    order: updatedOrder,
  });
});

const filterOrders = catchAsync(async (req, res, next) => {
  const { status, startDate, endDate, category, page, limit } = req.query;

  let filterCriteria = {};

  if (status) {
    filterCriteria.status = status;
  }

  if (startDate || endDate) {
    filterCriteria.createdAt = {};
    if (startDate) filterCriteria.createdAt.$gte = new Date(startDate);
    if (endDate) filterCriteria.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  let orders = await orderModel
    .find(filterCriteria)
    .populate({
      path: "products.productId",
      select: "name images price category",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .populate({
      path: "products.variantId",
      model: "Variant",
      select: "attributes stock images",
    })
    .populate("user", "username phonenumber address")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalOrders = await orderModel.countDocuments(filterCriteria);
  const totalPages = Math.ceil(totalOrders / limit);

  if (category) {
    orders = orders.filter((order) =>
      order.products.some(
        (product) => product.productId?.category?._id.toString() === category
      )
    );
  }

  if (orders.length === 0) {
    return res
      .status(404)
      .json({ message: "No orders found matching the criteria." });
  }

  res.status(200).json({
    message: "Orders retrieved successfully",
    orders,
    totalOrders,
    totalPages,
  });
});

const getOrderById = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await orderModel
    .findById(orderId)
    .populate({
      path: "products.productId",
      populate: {
        path: "category",
        model: "Category",
        select: "name description",
      },
    })
    .populate({
      path: "products.variantId",
      model: "Variant",
      select: "attributes stock images",
    })
    .populate("userId", "username email");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  res.status(200).json({
    message: "Order details retrieved successfully",
    order,
  });
});

const getUserOrders = catchAsync(async (req, res, next) => {
  const userId = req.user;
  const orders = await orderModel
    .find({ user: userId })
    .populate({
      path: "products.productId",
      populate: {
        path: "category",
        model: "Category",
        select: "name description",
      },
    })
    .populate({
      path: "products.variantId",
      model: "Variant",
      select: "attributes stock images",
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "User orders retrieved successfully",
    orders,
  });
});

const cancelOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.user;

  const order = await orderModel.findById(orderId);

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  if (order.user.toString() !== userId) {
    return next(
      new AppError("You are not authorized to cancel this order", 403)
    );
  }

  if (order.status !== "pending") {
    return next(new AppError("Only pending orders can be cancelled", 400));
  }

  // Restore stock for cancelled order
  const bulkOperations = order.products.map((product) => ({
    updateOne: {
      filter: { _id: product.productId },
      update: { $inc: { stock: product.quantity } },
    },
  }));

  await productModel.bulkWrite(bulkOperations);

  order.status = "cancelled";
  await order.save();

  res.status(200).json({
    message: "Order cancelled successfully",
    order,
  });
});

// const getAllOrders = catchAsync(async (req, res, next) => {
//   // Get page and limit from query params, set defaults if not provided
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;

//   try {
//     // Get total count for pagination
//     const totalOrders = await orderModel.countDocuments();
//     const totalPages = Math.ceil(totalOrders / limit);

//     // Fetch orders with pagination and populate necessary fields
//     const orders = await orderModel
//       .find()
//       .populate({
//         path: "user",
//         select: "username email phone", // Add the fields you want from user
//       })
//       .populate({
//         path: "products.productId",
//         select: "name images price offerPrice variant", // Add the fields you want from product
//         populate: {
//           path: "category",
//           select: "name",
//         },
//       })
//       .populate({
//         path: "products.variantId",
//       })
//       .sort({ createdAt: -1 }) // Sort by newest first
//       .skip(skip)
//       .limit(limit);

//     // Calculate pagination info
//     const paginationInfo = {
//       currentPage: page,
//       totalPages,
//       totalOrders,
//       hasNextPage: page < totalPages,
//       hasPrevPage: page > 1,
//       nextPage: page < totalPages ? page + 1 : null,
//       prevPage: page > 1 ? page - 1 : null,
//       limit,
//     };

//     // Group orders by status for analytics
//     const orderAnalytics = {
//       total: totalOrders,
//       completed: await orderModel.countDocuments({ status: "delivered" }),
//       confirmed: await orderModel.countDocuments({ status: "processing" }),
//       cancelled: await orderModel.countDocuments({ status: "cancelled" }),
//       refunded: await orderModel.countDocuments({ status: "refunded" }),
//     };

//     res.status(200).json({
//       status: "success",
//       message: "Orders fetched successfully",
//       data: {
//         orders,
//         pagination: paginationInfo,
//         analytics: orderAnalytics,
//       },
//     });
//   } catch (error) {
//     return next(new AppError("Error fetching orders", 500));
//   }
// });

const orderStats = catchAsync(async (req, res, next) => {
  const stats = await getOrderStats();
  res.status(200).json({
    message: "Order statistics retrieved successfully",
    stats,
  });
});

module.exports = {
  placeOrder,
  updateOrderStatus,
  filterOrders,
  getOrderById,
  getUserOrders,
  cancelOrder,
  orderStats,
};

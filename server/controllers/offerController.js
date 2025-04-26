const catchAsync = require("../utilities/errorHandlings/catchAsync");
const Offer = require("../model/offerModel");
const AppError = require("../utilities/errorHandlings/appError");
const uploadToCloudinary = require("../utilities/cloudinaryUpload");
const Product = require("../model/productModel");
const mongoose = require("mongoose");
const Variant = require("../model/variantsModel");

const buildAggregationPipeline = (newOffer, query) => {
  const aggregationPipeline = [query];
  return aggregationPipeline;
};

const createOffer = catchAsync(async (req, res, next) => {
  console.log(req.body, "=========req.body");
  const { bannerImage, ...offerData } = req.body;
  let hasVariants = false;

  if (typeof offerData.products === "string") {
    try {
      // Parse the string representation of an array
      offerData.products = JSON.parse(offerData.products);
    } catch (error) {
      console.error("Error parsing products JSON:", error);
      // If parsing fails, set it as an array with the string value
      offerData.products = [offerData.products];
    }
  }

  // Cast offerValue to Number
  offerData.offerValue = Number(offerData.offerValue);

  if (req.files && req.files.length > 0) {
    const imageFile = req.files[0];
    const uploadedImage = await uploadToCloudinary(imageFile.buffer);
    offerData.bannerImage = uploadedImage;
  }

  const newOffer = await Offer.create(offerData);
  console.log(newOffer, "=========newOffer");
  let productsCount = 0;

  const aggregationPipeline = buildAggregationPipeline(newOffer, {});

  // for category
  if (newOffer.offerType === "category") {
    aggregationPipeline[0] = {
      $match: { category: new mongoose.Types.ObjectId(newOffer.category) },
    };
  }

  // for brand
  if (newOffer.offerType === "brand") {
    aggregationPipeline[0] = {
      $match: { brand: new mongoose.Types.ObjectId(newOffer.brand) },
    };
  }

  // for group
  if (newOffer.offerType === "group") {
    aggregationPipeline[0] = {
      $match: {
        _id: {
          $in: newOffer.products.map((id) => new mongoose.Types.ObjectId(id)),
        },
      },
    };
  }

  // for brandCategory
  if (newOffer.offerType === "brandCategory") {
    aggregationPipeline[0] = {
      $match: { brand: newOffer.brand, category: newOffer.category },
    };
  }

  const products = await Product.aggregate(aggregationPipeline);
  console.log(products, "=========products");
  productsCount = products.length;
  newOffer.productsCount = productsCount;
  await newOffer.save();

  if (
    products.some(
      (product) => product?.variants && product?.variants?.length > 0
    )
  ) {
    hasVariants = true;
  } else {
    hasVariants = false;
  }

  //bulk operation for product if has NO VARIANTS
  if (!hasVariants) {
    const bulkOpsProduct = products?.map((product) => ({
      updateOne: {
        filter: { _id: product._id },
        update: [
          {
            $set: {
              offerPrice:
                newOffer.offerMetric === "percentage"
                  ? {
                      $subtract: [
                        "$price",
                        {
                          $multiply: [
                            "$price",
                            Number(newOffer.offerValue) / 100,
                          ],
                        },
                      ],
                    }
                  : { $subtract: ["$price", newOffer.offerValue] },
              offer: newOffer._id,
            },
          },
        ],
      },
    }));

    // Step 3: Execute bulk operations
    if (bulkOpsProduct.length > 0) {
      await Product.bulkWrite(bulkOpsProduct);
    }
  }

  //bulk operation for Variant if product has variants
  if (hasVariants) {
    const bulkOpsVariant = products.flatMap((product) => {
      // Store offer reference in product model
      const productUpdate = {
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { offer: newOffer._id } },
        },
      };

      const variantUpdates = product.variants.map((variant) => ({
        updateOne: {
          filter: { _id: variant._id },
          update: [
            {
              $set: {
                offerPrice:
                  newOffer.offerMetric === "percentage"
                    ? {
                        $subtract: [
                          "$price",
                          {
                            $multiply: [
                              "$price",
                              Number(newOffer.offerValue) / 100,
                            ],
                          },
                        ],
                      }
                    : { $subtract: ["$price", newOffer.offerValue] },
                offer: newOffer._id,
              },
            },
          ],
        },
      }));

      return [productUpdate, ...variantUpdates];
    });

    if (bulkOpsVariant.length > 0) {
      await Variant.bulkWrite(bulkOpsVariant);
    }
  }

  res.status(201).json({
    status: "success",
    data: { newOffer, productsCount },
  });
});

const getAllOffers = catchAsync(async (req, res, next) => {
  const offers = await Offer.find();
  res.status(200).json({
    status: "success",
    data: offers,
  });
});

const deleteOffer = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const offer = await Offer.findById(id);

  if (!offer) {
    return next(new AppError("Offer not found", 404));
  }

  // Find products associated with the offer
  const products = await Product.find({ offer: offer._id });

  console.log(products, "================products");

  // Check if any product has variants
  const hasVariants = products.some(
    (product) => product?.variants && product?.variants?.length > 0
  );

  console.log(hasVariants, "================hasVariants");

  // Reset offerPrice for products without variants
  if (!hasVariants) {
    const bulkOpsProduct = products.map((product) => ({
      updateOne: {
        filter: { _id: product._id },
        update: {
          $set: { offerPrice: product.price }, // Set offerPrice to the original price
          $unset: { offer: "" },
        },
      },
    }));

    if (bulkOpsProduct.length > 0) {
      await Product.bulkWrite(bulkOpsProduct);
    }
  }

  // Reset offerPrice for variants if products have variants
  if (hasVariants) {
    const bulkOpsVariant = products.flatMap((product) => {
      // Update the product to unset the offer reference
      const productUpdate = {
        updateOne: {
          filter: { _id: product._id },
          update: { $unset: { offer: "" } },
        },
      };

      const variantUpdates = product.variants.map((variant) => ({
        updateOne: {
          filter: { _id: variant._id },
          update: {
            $set: { offerPrice: variant.price }, // Set offerPrice to the original price
            $unset: { offer: "" },
          },
        },
      }));

      return [productUpdate, ...variantUpdates];
    });

    if (bulkOpsVariant.length > 0) {
      await Variant.bulkWrite(bulkOpsVariant);
    }
  }

  await offer.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Offer deleted successfully",
  });
});
module.exports = { createOffer, getAllOffers, deleteOffer };

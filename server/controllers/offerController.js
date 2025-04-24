const catchAsync = require("../utilities/errorHandlings/catchAsync");
const Offer = require("../model/offerModel");
const AppError = require("../utilities/errorHandlings/appError");
const uploadToCloudinary = require("../utilities/cloudinaryUpload");
// const uploadToCloudinary = require("../utilities/cloudinary");
// const path = require("path");
// const fs = require("fs");

const createOffer = catchAsync(async (req, res, next) => {
  const {
    title,
    subtitle,
    description,
    offerValue,
    offerType,
    link,
    image,
    offerName,
    offerMetric,
    startDate,
    endDate,
    category,
    brand,
    products,
  } = req.body;

  const offerData = {
    title,
    subtitle,
    description,
    offerValue,
    offerType,
    link,
    image,
    offerName,
    offerMetric,
    startDate,
    endDate,
  };

  // Validate offerType specific fields
  if (offerType === "category" && !category) {
    return next(new AppError("Category is required for category offerType", 400));
  }
  if (offerType === "brand" && !brand) {
    return next(new AppError("Brand is required for brand offerType", 400));
  }
  if (offerType === "group" && (!products || products.length === 0)) {
    return next(new AppError("Products are required for group offerType", 400));
  }

  // Add offerType specific fields to offerData
  if (category) offerData.category = category;
  if (brand) offerData.brand = brand;
  if (products) offerData.products = products;

  if (req.files && req.files.length > 0) {
    const imageFile = req.files[0];
    const uploadedImage = await uploadToCloudinary(imageFile.buffer);
    offerData.image = uploadedImage;
  }

  const newOffer = await Offer.create(offerData);

  res.status(201).json({
    status: "success",
    data: newOffer,
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

  // if (offer.image) {
  //   const imagePath = path.join("public", offer.image);
  //   if (fs.existsSync(imagePath)) {
  //     fs.unlinkSync(imagePath);
  //   }
  // }

  await offer.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Offer deleted successfully",
  });
});
module.exports = { createOffer, getAllOffers, deleteOffer };

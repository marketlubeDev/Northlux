const storeModel = require("../model/storeModel");
const createToken = require("../utilities/createToken");
const AppError = require("../utilities/errorHandlings/appError");
const catchAsync = require("../utilities/errorHandlings/catchAsync");

const createStore = catchAsync(async (req, res, next) => {
  const { store_name, email, address, store_number, login_number, password } =
    req.body;

  if (
    !store_name ||
    !email ||
    !password ||
    !address ||
    !store_number ||
    !login_number
  ) {
    return next(new AppError("All fields are required", 400));
  }

  const store = new storeModel({
    store_name,
    email,
    password,
    address,
    store_number,
    login_number,
  });

  const newStore = await store.save();

  res.status(201).json({
    success: true,
    message: "Store created successfully",
    store: newStore,
  });
});

const loginStore = catchAsync(async (req, res, next) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return next(new AppError("All fields are required", 400));
  }

  const store = await storeModel.findOne({
    login_number: phone,
    password,
  });

  if (!store) {
    return next(new AppError("Invalid phone or password", 401));
  }

  //   const isPasswordCorrect = await store.comparePassword(password);

  if (!isPasswordCorrect) {
    return next(new AppError("Invalid phone or password", 401));
  }

  const token = createToken(store._id, "store");

  const sotreDate = store.toObject();
  delete sotreDate.password;

  res.status(200).json({
    success: true,
    message: "Store logged in successfully",
    store: sotreDate,
    token,
  });
});

const getAllStores = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const stores = await storeModel
    .find()
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    message: "Stores fetched successfully",
    stores,
  });
});

const editStore = catchAsync(async (req, res, next) => {
  const { store_name, email, address, store_number, login_number, password } =
    req.body;
  if (!store_name || !email || !address || !store_number || !login_number) {
    return next(new AppError("All fields are required", 400));
  }
  const { id } = req.params;

  const store = await storeModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json({
    success: true,
    message: "Store updated successfully",
    store,
  });
});

module.exports = { createStore, loginStore, getAllStores, editStore };

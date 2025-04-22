const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  store_name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  store_number: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  login_number: {
    type: Number,
    required: true,
  },
  login_password: {
    type: String,
    required: true,
  },
});

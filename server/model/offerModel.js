const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  offerType: {
    type: String,
    enum: ["group", "category", "brand", "brandCategory"],
    required: true,
  },
  offerName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: function () {
      return this.offerType === "category";
    },
  },
  brand: {
    type: String,
    required: function () {
      return this.offerType === "brand";
    },
  },
  products: {
    type: [String],
    required: function () {
      return this.offerType === "group";
    },
  },
  offerMetric: {
    type: String,
    required: true,
  },
  offerValue: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  bannerImage: {
    type: String,
    required: false,
  },
});

const Offer = mongoose.model("Offer", offerSchema);

module.exports = Offer;

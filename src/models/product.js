const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  model: {
    type: String,
  },
  brand: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  numReviews: {
    type: Number,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
    },
  ],
  ratingProduct: {
    type: Number,
    default: 0,
    required: true,
  },
  sales: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Product", productSchema);

const mongoose = require("mongoose");

const heartRateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },

  time: {
    type: String,
    required: true,
  },

  heartRate: {
    type: Number,
    required: true,
  },

  avgHeartRate: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("HeartRate", heartRateSchema);

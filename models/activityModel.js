const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { url } = require("inspector");

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },

  steps: {
    type: Number,
    required: true,
  },

  distance: {
    type: Number,
    required: true,
  },

  runDistance: {
    type: Number,
    required: true,
  },

  calories: {
    type: Number,
    required: true,
  },

  activityType: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Activity", activitySchema);

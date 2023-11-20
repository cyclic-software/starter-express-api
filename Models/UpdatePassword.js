// models/User.js

const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
    default: null,
  },
});

const Update = mongoose.model("Update", updateSchema);

module.exports = Update;

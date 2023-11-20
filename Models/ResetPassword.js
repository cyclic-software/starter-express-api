const mongoose = require("mongoose");

const resetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiration: {
    type: Date,
    required: true,
  },
});

const Reset = mongoose.model("Reset", resetSchema);

module.exports = Reset;

const mongoose = require("mongoose");
const { model } = require("mongoose");

const userSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: {
    type: { type: String, required: true },
    coordinates: [Number],
  },
});

userSchema.index({ location: "2dsphere" }); // Create a 2dsphere index on the location field

module.exports = model("users", userSchema);

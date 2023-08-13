const mongoose = require("mongoose");
const { model } = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  imageId: { type: Number, required: true },
  location: {
    type: { type: String },
    coordinates: [Number],
  },
});

userSchema.index({ location: "2dsphere" }); // Create a 2dsphere index on the location field

module.exports = model("users", userSchema);

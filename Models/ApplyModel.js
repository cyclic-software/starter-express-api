// Assuming you have Mongoose installed and required in your application
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  idnumber: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Application model
const Application = mongoose.model("Application", applicationSchema);

// Export the Application model
module.exports = Application;

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Your username is required"],
  },
  idnumber: {
    type: String,
    required: [true, "Your id number is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Your confirmation password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = await bcrypt.hash(this.confirmPassword, 12);
});

// Add a static method to the User model to fetch all users
userSchema.statics.fetchAll = async function () {
  try {
    const users = await this.find();
    return users;
  } catch (error) {
    console.error("Error fetching users", error);
    throw new Error("Failed to fetch users");
  }
};

module.exports = mongoose.model("User", userSchema);

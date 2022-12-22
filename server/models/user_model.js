import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  appointments: {
    type: Array,
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

export default User;

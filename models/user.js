const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  phoneno: { type: String, default: "" },
  googleAuthToken: { type: String, default: "" },
  dob: { type: Date },
  signupmethod: { type: String, default: "" },
  isPhoneVerified: { type: Boolean, default: false },
  isverifiedUser: { type: Boolean, default: false },
  userProfileimage: { type: String },
  clientIp: { type: String },
  resetpassword_code: { type: String },
  firebase_token: { type: String, default: "" },

  created_at: { type: Date },
  updated_at: { type: Date },
});

module.exports = mongoose.model("users_tbls", userSchema);

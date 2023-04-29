const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  updateUserData,
} = require("../controllers/user_controller");

const route = express.Router();

// users related routes
route.route("/user-register").post(registerUser);
route.route("/user-login").post(loginUser);
route.route("/user-logout").post(logoutUser);

// user details route
route.route("/user-me").get(getUserDetails);
route.route("/user-me/:userId").put(updateUserData);

route.route("/test").get((req, res) => {
  res.status(200).json({ success: true, message: "Server is running..." });
});

module.exports = route;

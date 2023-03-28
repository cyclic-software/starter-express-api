const express = require("express");
const auth = require("../middlewares/auth");
// const rateLimit = require("express-rate-limit");
const config = process.env;
const router = express.Router();

// controllers listed here --tejasborate1110 //
const userController = require("../controllers/userController");
const chatUsersController = require("../controllers/chatUsers");

router.post("/checkPhonenumber", userController.checkPhonenumber);

router.post("/signup", userController.userRegister);

router.post("/login", userController.userLogin);

router.post("/updateDetails", auth, userController.updateDetails);

router.post("/userdetails", auth, userController.userdetails);

router.post("/getchatusers", auth, chatUsersController.getmessageableusers);

router.post("/addChats", auth, chatUsersController.addChats);

// getmychats
router.post("/getmychats", auth, chatUsersController.getmychats);

// uploadProfile
router.post("/uploadProfile", auth, userController.uploadProfile);
module.exports = router;

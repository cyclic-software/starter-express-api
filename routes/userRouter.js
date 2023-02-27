const express = require("express");
const auth = require("../middlewares/auth");
// const rateLimit = require("express-rate-limit");
const config = process.env;
const router = express.Router();

// controllers listed here --tejasborate1110 //
const userController = require("../controllers/userController");

router.post("/checkPhonenumber", userController.checkPhonenumber);

router.post("/signup", userController.userRegister);

router.post("/login", userController.userLogin);

router.post("/updateDetails", auth, userController.updateDetails);

router.post("/userdetails", auth, userController.userdetails);

module.exports = router;

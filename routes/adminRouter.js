const express = require("express");
// const auth = require("../middleware/auth");
// const rateLimit = require("express-rate-limit");
const config = process.env;
const router = express.Router();

// controllers listed here --tejasborate1110 //
const userController = require("../controllers/userController");

router.post("/signuptest", userController.userRegister);

router.post("/logintest", userController.userLogin);

module.exports = router;

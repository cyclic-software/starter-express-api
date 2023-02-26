const express = require("express");
// const auth = require("../middleware/auth");
// const rateLimit = require("express-rate-limit");
const config = process.env;
const router = express.Router();

// controllers listed here --tejasborate1110 //
const userController = require("../controllers/userController");

router.post("/signup", userController.userRegister);

router.post("/login", userController.userLogin);

router.post("/updateDetails", userController.updateDetails);

module.exports = router;

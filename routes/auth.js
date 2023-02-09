const router = require("express").Router();
const authController = require("../controller/auth");
const { check, body } = require("express-validator");

router.post(
  "/signup",
  body("email").isEmail(),
  body("password").isLength({ min: 5, max: 20 }),
  authController.signup
);

router.post("/login", authController.login);

module.exports = router;
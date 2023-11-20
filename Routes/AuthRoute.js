const { Signup, Login } = require("../Controllers/AuthController");
const router = require("express").Router();
const { resetPassword } = require("../Controllers/ResetControl");
const { updatePassword } = require("../Controllers/UpdateController");

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/reset-password", resetPassword);
router.post("/update-password", updatePassword);

module.exports = router;

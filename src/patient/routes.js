const express = require("express");
const router = express.Router();
const {
  createNewPatient,
  authenticatePatient,
  getProfile,
  editProfile,
} = require("./controller");
const {
  validateProfile,
  validateSignup,
  validateSignin,
} = require("../middleware/dataValidation");
const { verifyToken } = require("../middleware/auth");

//Signup route
router.post("/signup", validateSignup);

//Signin
router.post("/signin", validateSignin);

//Consulter profile
router.get("/profile", verifyToken, getProfile);

// //Mettre à jour son profile
router.post("/editProfile", verifyToken, validateProfile, editProfile);

module.exports = router;

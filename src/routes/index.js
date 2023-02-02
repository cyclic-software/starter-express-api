const express = require("express");
const router = express.Router();

const patientRoutes = require("../patient");
const adminRoutes = require("../admin");

router.use("/patient", patientRoutes);
router.use("/admin", adminRoutes);

module.exports = router;

const express = require("express");
const router = express.Router();
const applicationController = require("../Controllers/ApplicationController");
const applicationMiddleware = require("../Middlewares/ApplicationMiddleware");

// POST /applications - Route to submit a new application
router.post(
  "/apply-student",
  applicationMiddleware.validateDateOfBirth,
  applicationController.submitApplication
);

// DELETE /applications/idnumber/:idnumber - Route to delete an application by idnumber
router.delete(
  "/apply-delete/idnumber/:idnumber",
  applicationController.deleteApplication
);

// GET /applications/idnumber/:idnumber - Route to get an application by idnumber
router.get(
  "/apply-get/idnumber/:idnumber",
  applicationController.getApplication
);

module.exports = router;

const moment = require("moment");
const Application = require("../Models/ApplyModel");
const { createSecretToken } = require("../util/SecretToken");

// Controller for submitting a new application
exports.submitApplication = async (req, res, next) => {
  try {
    const {
      email,
      idnumber,
      dateOfBirth,
      firstName,
      lastName,
      street,
      city,
      state,
      zip,
    } = req.body;

    // Step 1: Length Check
    const idNumberPattern = /^[0-9]{13}$/;
    if (!idNumberPattern.test(idnumber)) {
      return res.status(400).json({ error: "Invalid ID number" });
    }

    // Step 2: Date Validation
    const birthDate = moment(dateOfBirth, "YYYY-MM-DD");
    if (!birthDate.isValid()) {
      return res.status(400).json({ error: "Invalid date of birth" });
    }

    // Step 3: Citizenship Check
    const citizenshipDigit = parseInt(idnumber.charAt(10), 10);
    if (citizenshipDigit !== 0) {
      return res
        .status(400)
        .json({ error: "Invalid citizenship in ID number" });
    }

    const existingApplicationByIdNumber = await Application.findOne({
      idnumber,
    });
    const existingApplicationByEmail = await Application.findOne({ email });

    if (existingApplicationByIdNumber || existingApplicationByEmail) {
      return res.status(400).json({ error: "Application already submitted" });
    }

    const application = await Application.create({
      email,
      idnumber,
      dateOfBirth,
      firstName,
      lastName,
      street,
      city,
      state,
      zip,
    });

    const token = createSecretToken(application._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(201).json({
      message: "Application submitted successfully",
      success: true,
      application,
    });

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for deleting an application by idnumber
exports.deleteApplication = async (req, res) => {
  try {
    const { idnumber } = req.params;

    // Delete the application without checking if it exists or has been submitted
    await Application.deleteOne({ idnumber });

    res.json({ message: "Application deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller for getting an application by idnumber
exports.getApplication = async (req, res, next) => {
  try {
    const { idnumber } = req.params;

    const application = await Application.findOne({ idnumber });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

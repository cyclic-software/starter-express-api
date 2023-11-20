// applicationMiddleware.js

const moment = require("moment");

// Middleware to validate the dateOfBirth field
exports.validateDateOfBirth = (req, res, next) => {
  const { dateOfBirth } = req.body;

  // Check if dateOfBirth is a valid date
  if (!moment(dateOfBirth, "YYYY-MM-DD").isValid()) {
    return res.status(400).json({ error: "Invalid date of birth" });
  }

  next();
};

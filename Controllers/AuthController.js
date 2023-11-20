const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const moment = require("moment");

// Regular expression pattern for South African ID number format
const idNumberPattern = /^0?\d{13}$/;

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, confirmPassword, idnumber, username, createdAt } =
      req.body;

    // Step 1: Length Check
    if (!idNumberPattern.test(idnumber)) {
      return res.status(400).json({ error: "Invalid RSA ID number" });
    }

    // Step 2: Date Validation
    const birthDate = moment(idnumber.substring(0, 6), "YYMMDD");
    if (!birthDate.isValid()) {
      return res.status(400).json({ error: "Invalid birth date in ID number" });
    }

    // Step 3: Citizenship Check
    const citizenshipDigit = parseInt(idnumber.charAt(10), 10);
    if (citizenshipDigit !== 0) {
      return res
        .status(400)
        .json({ error: "Invalid citizenship in ID number" });
    }

    const existingUserByIdNumber = await User.findOne({ idnumber });
    const existingUserByEmail = await User.findOne({ email });

    if (existingUserByIdNumber || existingUserByEmail) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create({
      email,
      password,
      confirmPassword,
      idnumber,
      username,
      createdAt,
    });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User registered successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { idnumber, password } = req.body;
    if (!idnumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ idnumber });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Incorrect ID number or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Incorrect ID number or password" });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Enable this if using HTTPS
      sameSite: "strict", // Adjust according to your requirements
    });
    res
      .status(200)
      .json({ message: "User logged in successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

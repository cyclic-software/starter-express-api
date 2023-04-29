const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const jwt = require("jsonwebtoken");

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return next(new ErrorHandler("Please enter all the details.", 400));
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  sendToken(user, 201, res, "User registered successfylly");
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  // find the email and password in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  // check that the password is matched with our database by using own define comparePassword method
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res, "User login successsfully");
});

exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return next(new ErrorHandler("Missing token", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  res.status(200).json({ success: true, user });
});

// update user data
exports.updateUserData = catchAsyncError(async (req, res, next) => {
  const { weight, height, bmi, gender, fullName } = req.body;
  const userId = req.params.userId;

  let message = "";

  if (weight) {
    const response = await User.findByIdAndUpdate(
      userId,
      { weight: weight },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    if (response) {
      message = "Updated your weight.";
    }
  }

  if (height) {
    const response = await User.findByIdAndUpdate(userId, height, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (response) {
      message = "Updated your height.";
    }
  }

  if (bmi) {
    const response = await User.findByIdAndUpdate(userId, bmi, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (response) {
      message = "Updated your BMI.";
    }
  }

  if (gender) {
    const response = await User.findByIdAndUpdate(userId, gender, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (response) {
      message = "Updated your gender.";
    }
  }

  if (fullName) {
    const response = await User.findByIdAndUpdate(userId, fullName, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (response) {
      message = "Updated your fullName.";
    }
  }

  res.status(200).json({
    success: true,
    message: message,
  });
});

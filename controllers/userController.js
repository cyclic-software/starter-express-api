const User = require("../models/user");
const jwt = require("jsonwebtoken");

const checkPhonenumber = async (req, res, next) => {
  try {
    let { phonenum } = req.body;
    let checkgiventhis = await User.find({ phoneno: phonenum });

    if (checkgiventhis && checkgiventhis.length > 0) {
      throw new Error("This phone number already exist, please login");
    } else {
      return res.status(200).json({
        status: 1,
        message: "Verification code sent to this phone number",
        data: [],
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(200).json({
      status: 0,
      message: err.message,
      data: [],
    });
  }
};

const userRegister = async (req, res, next) => {
  try {
    let {
      phoneno,
      signupmethod,
      googleAuthToken,
      firebaseConfirmation,
      firebase_token,
    } = req.body;

    let checkPhone = await User.findOne({ phoneno: phoneno });

    if (checkPhone) {
      throw new Error("This phone number already exist please login");
    }

    if (phoneno !== "" && firebaseConfirmation) {
      let Userregister = await User.create({
        phoneno,
        signupmethod,
        isPhoneVerified: true,
        firebase_token,
        created_at: new Date(),
        updated_at: new Date(),
      });

      let token = jwt.sign(
        { user_id: `${Userregister._id}` },
        "DATERAPPNATIVE1110",
        {
          expiresIn: "30d",
        }
      );

      console.log("tokendata ========> ", token);
      let fresponse = {
        ...Userregister._doc,
        accesstoken: token,
      };

      if (Userregister) {
        return res.status(200).json({
          status: 1,
          message: "Regsitration successful",
          data: fresponse,
        });
      } else {
        throw new Error("Unknow error occured please try again");
      }
    } else {
      return res.status(200).json({
        status: 3,
        message: "Invalid Request",
        data: [],
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(200).json({
      status: 0,
      message: err.message,
      data: [],
    });
  }
};

const userLogin = async (req, res, next) => {
  try {
    let { phoneno, signupmethod, googleAuthToken } = req.body;

    return res.status(200).json({
      status: 1,
      message: "Hitted Login",
      data: ["success"],
    });
  } catch (err) {
    console.log(err.message);
    return res.status(200).json({
      status: 0,
      message: err.message,
      data: [],
    });
  }
};

const updateDetails = async (req, res, next) => {
  try {
    let user_id = req.user.user_id;
    let { name, email, phoneno, dob } = req.body;

    if (!user_id) {
      throw new Error("Invalid Request");
    }
    let updateUserDetails = await User.findOneAndUpdate(
      { _id: user_id },
      { name, email, phoneno, dob },
      { new: true }
    );

    if (updateUserDetails) {
      return res.status(200).json({
        status: 1,
        message: "Details updated",
        data: updateUserDetails,
      });
    } else {
      throw new Error("Invalid Request");
    }
  } catch (err) {
    console.log(err.message);
    return res.status(200).json({
      status: 0,
      message: err.message,
      data: [],
    });
  }
};

const userdetails = async (req, res, next) => {
  try {
    let user_id = req.user.user_id;

    let findUserbuuserid = await User.findOne({ _id: user_id });

    if (findUserbuuserid) {
      return res.status(200).json({
        status: 1,
        message: "User details",
        data: findUserbuuserid,
      });
    } else {
      return res.status(200).json({
        status: 3,
        message: "User not found",
        data: [],
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(200).json({
      status: 0,
      message: err.message,
      data: [],
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
  updateDetails,
  checkPhonenumber,
  userdetails,
};

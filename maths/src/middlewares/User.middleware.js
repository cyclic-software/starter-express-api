const { sendErrorResp } = require("../Common/common-res");
const {
  isValisUsername,
  isValisEmail,
  isValisPassword,
  isValidGender,
  userGenders,
} = require("../utils/userUtils");

module.exports = {
  loginUserValidation: (req, res, next) => {
    const { password, username } = req.body;
    const errors = {};

    if (!username) {
      errors.username = "username is required";
    }

    if (!password) {
      errors.password = "password is required";
    }

    if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
      return sendErrorResp(res, 400, errors);
    } else {
      return next();
    }
  },
  createUserValidation: (req, res, next) => {
    const { firtsName, lastName, email, password, username, gender } = req.body;
    const errors = {};

    if (!firtsName) {
      errors.firtsName = "firtsName is required";
    }

    if (!lastName) {
      errors.lastName = "lastName is required";
    }

    if (!username) {
      errors.username = "username is required";
    } else if (!isValisUsername(username)) {
      errors.username = "Invalid username";
    }

    if (!email) {
      errors.email = "email is required";
    } else if (!isValisEmail(email)) {
      errors.email = "Invalid email";
    }

    if (!password) {
      errors.password = "password is required";
    } else if (!isValisPassword(password)) {
      errors.password =
        "password should contain 8 letters, with at least a symbol, upper and lower case letters and a number";
    }

    if (!gender) {
      errors.gender = "gender is required";
    } else if (!isValidGender(gender)) {
      errors.gender = `allowed genders are ${userGenders}`;
    }

    if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
      return sendErrorResp(res, 400, errors);
    } else {
      next();
    }
  },
};

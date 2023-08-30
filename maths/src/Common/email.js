let isValidUser = true;
let msg = "";

const isValidEmail = (email) => {
  var re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const isValidPassword = (password) => {
  // at least one number, one lowercase and one uppercase letter
  // at least six characters that are letters, numbers or the underscore
  var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
  return re.test(password);
};

const isValidUserModel = (userValue) => {
  if (!userValue.email) {
    isValidUser = false;
    msg = "Email is required";
    return [isValidUser, msg];
  } else if (!isValidEmail(userValue.email)) {
    isValidUser = false;
    msg = "You have entered an invalid email address!";
    return [isValidUser, msg];
  } else if (!userValue.username) {
    isValidUser = false;
    msg = "username is required";
    return [isValidUser, msg];
  } else if (!userValue.password) {
    isValidUser = false;
    msg = "password is required";
    return [isValidUser, msg];
  } else if (!isValidPassword(userValue.password)) {
    isValidUser = false;
    msg =
      "Passwords must contain at least six characters, including uppercase, lowercase letters and numbers";
    return [isValidUser, msg];
  } else if (!userValue.user_type) {
    isValidUser = false;
    msg = "user_type is required";
    return [isValidUser, msg];
  } else if (!isValidUserType(userValue.user_type)) {
    isValidUser = false;
    msg = "Not a valid user_type";
    return [isValidUser, msg];
  } else if (!userValue.site_id) {
    isValidUser = false;
    msg = "site_id is required";
    return [isValidUser, msg];
  } else if (!isValidSiteId(userValue.site_id)) {
    isValidUser = false;
    msg = "Not a valid site_id";
    return [isValidUser, msg];
  } else {
    isValidUser = true;
    msg = "";
    return [isValidUser, msg];
  }
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidUserModel,
};

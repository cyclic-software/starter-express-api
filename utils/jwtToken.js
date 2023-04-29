// Creating token and saving in cookie
const sendToken = (user, statusCode, res, msg) => {
  const token = user.getJWTToken();

  // options for cookies
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 3600000),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message: msg,
    user,
    token,
  });
};

module.exports = sendToken;

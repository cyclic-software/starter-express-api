const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  // console.log(authHeader);

  if (!authHeader) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
    //next(error);
  }

  const token = authHeader.split(" ")[1];
  // console.log(token);

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secretKey");
    // console.log(decodedToken);
  } catch (err) {
    // console.log("Hi 1")
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    // console.log("Hi 2", decodedToken);
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
};

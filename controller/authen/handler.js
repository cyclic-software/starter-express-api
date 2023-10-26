const jwt = require("jsonwebtoken");
require("dotenv/config");

const secret = process.env.SECRET_KEY;
const handlerAuthen = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(403).send("token is a required");
  }
  try {
    const decoded = jwt.verify(token.split(" ")[1], secret);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
  return next();
};

module.exports = handlerAuthen;
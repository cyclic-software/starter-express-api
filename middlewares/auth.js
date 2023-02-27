const jwt = require("jsonwebtoken");
//const common_helper = require("../helper/common_helper");
const common_helper = require("../helper/common_helper");

const config = process.env;

const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    const decodedjwttoken = jwt.verify(token, "DATERAPPNATIVE1110");
    req.user = decodedjwttoken;
    // console.log("user  =======>", req.user)

    if (!token) {
      return res.status(403).send({
        message: "A token is required for authentication",
        status: 0,
      });
    }
    req.user = decodedjwttoken;
    // console.log("user2 =======>", req.user)
  } catch (err) {
    // console.log("Authentication error ======> " + err.message);
    return res.status(401).send({
      message: "Invalid Token",
      status: 2,
    });
  }
  return next();
};

module.exports = verifyToken;

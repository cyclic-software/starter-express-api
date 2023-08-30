const { sign, decode, verify } = require("jsonwebtoken");
const { JWT_SECRET, jwtExpirySeconds } = require("../Config/config");
const options = {
  expiresIn: jwtExpirySeconds,
};

module.exports = {
  getToken: (data) => {
    let payload = {};
    if (typeof data !== "object") {
      payload.data = data;
    } else {
      payload = data;
    }
    return sign(payload, JWT_SECRET, options);
  },
  verifyToken: (token) => {
    return verify(token, JWT_SECRET);
  },
  decodeToken: (token) => {
    return decode(token, { complete: true });
  },
};

require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync("private.key", "utf8");

const createSecretToken = (id) => {
  return jwt.sign({ id }, privateKey, {
    algorithm: "RS256",
    expiresIn: 3 * 24 * 60 * 60,
  });
};

module.exports.createSecretToken = createSecretToken;

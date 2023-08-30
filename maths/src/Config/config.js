const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 9001;
const JWT_SECRET =
  process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJ";
const jwtExpirySeconds = process.env.jwtExpirySeconds || '1h';
const STRING_ENCRYPTR =
  process.env.STRING_ENCRYPTR || "hjbghbkfhebqfkjefkjefkjefkjef";
const Env = process.env.env_type || "dev";
const dbUrl = process.env.dbUrl;

module.exports = {
  PORT,
  JWT_SECRET,
  jwtExpirySeconds,
  STRING_ENCRYPTR,
  Env,
  dbUrl,
};

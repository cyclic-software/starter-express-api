const DB_URL = process.env.DB_URL || "";
const PORT = parseInt(process.env.PORT || "7000");
const CLIENT = process.env.CLIENT || "*";
const EXPIRATION_TIME = parseInt(process.env.EXPIRATION_TIME || "60000"); // seconds
const EMAIL_HOST = process.env.EMAIL_HOST || "";
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || "");
const EMAIL_USER = process.env.EMAIL_USER || "";
const EMAIL_PASS = process.env.EMAIL_PASS || "";
const USER_SECRET = process.env.USER_SECRET || "";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "";
const LOGIN_COOKIE = process.env.LOGIN_COOKIE || "";
const EWU_WEBSITE = process.env.EWU_WEBSITE || "";

module.exports = {
  DB_URL,
  PORT,
  CLIENT,
  EXPIRATION_TIME,
  EMAIL_HOST,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_PASS,
  USER_SECRET,
  ADMIN_SECRET,
  LOGIN_COOKIE,
  EWU_WEBSITE,
};

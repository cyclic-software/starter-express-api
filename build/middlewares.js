"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.publicOnlyMiddleware = exports.protectorMiddleware = exports.localsMiddleware = exports.itemFiles = exports.boardImgFiles = exports.avatarFiles = exports.adminOnlyMiddleware = void 0;
var _multer = _interopRequireDefault(require("multer"));
var _multerS = _interopRequireDefault(require("multer-s3"));
var _awsSdk = _interopRequireDefault(require("aws-sdk"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var s3 = new _awsSdk["default"].S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
  }
});
var isHeroku = process.env.MODE === "production";
var avatarUploader = (0, _multerS["default"])({
  s3: s3,
  bucket: "wetube-jeongkong/avatar-board",
  acl: "public-read"
});
var boardImgUploader = (0, _multerS["default"])({
  s3: s3,
  bucket: "wetube-jeongkong/info-board",
  acl: "public-read"
});
var localsMiddleware = function localsMiddleware(req, res, next) {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isAdmin = req.session.isAdmin || false;
  res.locals.isHeroku = isHeroku;
  res.locals.shopPidCode = process.env.SHOP_PID_CODE;
  res.locals.devDomain = "http://localhost:5050";
  res.locals.domain = "https://aboutcafeboard.herokuapp.com";
  next();
};
exports.localsMiddleware = localsMiddleware;
var protectorMiddleware = function protectorMiddleware(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};
exports.protectorMiddleware = protectorMiddleware;
var publicOnlyMiddleware = function publicOnlyMiddleware(req, res, next) {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};
exports.publicOnlyMiddleware = publicOnlyMiddleware;
var adminOnlyMiddleware = function adminOnlyMiddleware(req, res, next) {
  if (req.session.isAdmin) {
    return next();
  } else {
    return res.redirect("/");
  }
};
exports.adminOnlyMiddleware = adminOnlyMiddleware;
var avatarFiles = (0, _multer["default"])({
  dest: "uploads/avatar",
  limits: {
    fileSize: 10000000
  },
  storage: isHeroku ? avatarUploader : undefined
});
exports.avatarFiles = avatarFiles;
var boardImgFiles = (0, _multer["default"])({
  dest: "uploads/board",
  limits: {
    fileSize: 10000000
  },
  storage: isHeroku ? boardImgUploader : undefined
});
exports.boardImgFiles = boardImgFiles;
var itemFiles = (0, _multer["default"])({
  dest: "uploads/item",
  limits: {
    fileSize: 10000000
  }
});
exports.itemFiles = itemFiles;
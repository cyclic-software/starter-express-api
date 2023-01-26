import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const isHeroku = process.env.MODE === "production";

const avatarUploader = multerS3({
  s3: s3,
  bucket: "wetube-jeongkong/avatar-board",
  acl: "public-read",
});
const boardImgUploader = multerS3({
  s3: s3,
  bucket: "wetube-jeongkong/info-board",
  acl: "public-read",
});

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  res.locals.isAdmin = req.session.isAdmin || false;
  res.locals.isHeroku = isHeroku;
  res.locals.shopPidCode = process.env.SHOP_PID_CODE;
  res.locals.devDomain = "http://localhost:5050";
  res.locals.domain = "https://aboutcafeboard.herokuapp.com";
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const adminOnlyMiddleware = (req, res, next) => {
  if (req.session.isAdmin) {
    return next();
  } else {
    return res.redirect("/");
  }
};

export const avatarFiles = multer({
  dest: "uploads/avatar",
  limits: {
    fileSize: 10000000,
  },
  storage: isHeroku ? avatarUploader : undefined,
});
export const boardImgFiles = multer({
  dest: "uploads/board",
  limits: {
    fileSize: 10000000,
  },
  storage: isHeroku ? boardImgUploader : undefined,
});

export const itemFiles = multer({
  dest: "uploads/item",
  limits: {
    fileSize: 10000000,
  },
});

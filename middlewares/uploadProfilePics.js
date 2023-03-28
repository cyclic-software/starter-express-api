const cloudinary = require("cloudinary").v2;
const util = require("util");
const multer = require("multer");
const maxSize = 50 * 1024 * 1024;
cloudinary.config({
  cloud_name: "dsb6hxs2q",
  api_key: "332881871931773",
  api_secret: "7FVQNp0lXZ5XipPVOhqoDcu0WuA",
});

const fileFilter = (req, file, cb) => {
  let validationFilenameArr = ["jpg", "jpeg", "png"];
  let originalFilename = file.originalname;
  let splittedFilename = originalFilename.split(".");
  let checkvalidisvalidfile = validationFilenameArr.includes(
    splittedFilename[1]
  );
  console.log("fileext ==>" + checkvalidisvalidfile);
  if (checkvalidisvalidfile) {
    cb(null, true);
  } else {
    cb("Image type is not valid", false);
  }
};

const uploadFile = multer({
  storage: multer.diskStorage({}),
  fileFilter,
}).single("profileImage");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;

// Configuration

// Upload

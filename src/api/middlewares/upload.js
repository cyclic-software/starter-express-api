const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const { AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY, AWS_REGION} = require('../../utils');

// create s3 instance using S3Client 
// (this is how we create s3 instance in v3)


const aws = require("aws-sdk");

const s3 = new aws.S3();

aws.config.update({
  secretAccessKey: AWS_ACCESS_KEY_ID,
  accessKeyId: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: "cyclic-lonely-tank-top-colt-eu-north-1",
    metadata: function (req, file, cb) {
      console.log(file)
      cb(null, { fieldName: "TESTING_METADATA" });
    },
    key: function (req, file, cb) {
      console.log(file)
      cb(null, Date.now().toString());
    },
  }),
});

module.exports = upload;
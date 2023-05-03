// const util = require("util");
// const multer = require("multer");
// var path = require('path');
// var fs = require('fs');

// const maxSize = 2 * 1024 * 1024;
// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     var dir =  "./public/uploads/"+req.body.folder_name;
//     if (!fs.existsSync(dir)){
//       fs.mkdirSync(dir);
//     }
//     cb(null,  dir  );
//   },
//   filename: (req, file, cb) => {
//     req.media_file = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    
//     cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// let uploadFile = multer({
//   storage: storage,
//   limits: { fileSize: maxSize },
// }).single("file");


//     // create the exported middleware object
// let uploadFileMiddleware = util.promisify(uploadFile);
// module.exports = uploadFileMiddleware;
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Importing Shop model
import Shop from '../../model/shop/shop.js';

// Importing custom error
import customError from '../../utils/error.js';

// multer middle setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!isImage(file.mimetype) || file.size > 10 * 1024 * 1024) {
      return cb(new Error('Invalid file type or size'));
    }

    const dir = `public/images/shop/${req.body.name}`;

    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, (error) => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: (req, file, cb) => {
    const fileName = path.parse(file.originalname).name;
    const extension = path.parse(file.originalname).ext;
    cb(null, `${fileName}${Date.now()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!isImage(file.mimetype)) {
    return cb(new Error('Invalid file type, image only!'));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

function isImage(mimeType) {
  const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  return imageMimeTypes.includes(mimeType);
}


// Create shop controller
export const createShop = async (req, res, next) => {
  try {
    let imageNames 
    if (req.file) {
      imageNames = req.file.filename;
    }

    const newShop = new Shop({
      ...req.body,
      image: imageNames,
      owner: req.user._id,
    });

    // Check if shop already exists
    const shopExist = await Shop.findOne({ name: req.body.name });

    if (shopExist) {
      return next(customError(401, "Shop already exists"));
    }
    const shop = await newShop.save();

    res.status(201).json({
      status: "success",
      message: `Shop ${shop.name} created successfully`,
      shop,
    });
  } catch (err) {
    next(err);
  }
};

// List all shops controller
export const allShops = async (req, res, next) => {
  try {
    const shops = await Shop.find()
    if (!shops) {
      return next(customError(400, "Unable to list all shops"));
    }
    res.status(200).json({
      status: "success",
      shops,
    });
  } catch (err) {
    next(err);
  }
};

// Update a single shop controller
export const updateShop = async (req, res, next) => {
  try {
    const singleShop = req.params.id;
    let imageNames 
    if (req.file) {
      imageNames = req.file.filename;
    }

    const shop = await Shop.findByIdAndUpdate(singleShop, {$set: req.body, image: imageNames}, {new:true, runValidators:true});
    if (!shop) {
        return next(
            customError(404, `Shop with id ${singleShop} does not exist`),
        );
    }
    res.status(200).json({
        status: "success",
        message: `Shop ${shop.name} updated successfully `,
        shop,
    });
  } catch (err) {
    next(err);
  }
};

// find a single Shop controller
export const singleShop = async (req, res, next) => {
  try {
    const singleShop = req.params.id;
    const shop = await Shop.findById(singleShop);
    if (!shop) {
      return next(
        customError(404, `Shop with id ${singleShop} does not exist`)
      );
    }
    res.status(200).json({
      status: "success",
      shop,
    });
  } catch (err) {
    next(err);
  }
};

// Delete a single shop controller
export const deleteShop = async (req, res, next) => {
  try {
    const singleShop = req.params.id;
    const shop = await Shop.findByIdAndDelete(singleShop);
    if (!shop) {
      return next(
        customError(404, `Shop with id ${singleShop} does not exist`),
      );
    }
    res.status(204).json({
      status: "success"
    });
  } catch (err) {
    next(err);
  }
};
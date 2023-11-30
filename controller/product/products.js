import multer from 'multer';
import Product from '../../model/product/products.js';
import customError from '../../utils/error.js';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!isImage(file.mimetype) || file.size > 10 * 1024 * 1024) {
      return cb(new Error('Invalid file type or size'));
    }

    const dir = `public/images/products/${req.body.name}`;

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

// create product controller
export const createProduct = async (req, res, next) => {
  try {
    let imageNames = [];
    if (req.files) {
      imageNames = req.files.map((file) => file.filename);
    }

    const product = await Product.create({
      ...req.body,
      image: imageNames,
      // seller: req.user_id,
    });

    if (!product) {
      return next(customError(404, 'Unable to create product'));
    }

    res.status(201).json({
      status: 'success',
      message: `product ${product.name} created successfully`,
      product,
    });
  } catch (err) {
    next(err);
  }
};

// list all product controller
export const allProducts = async (req, res, next) => {
  try {
    const product = await Product.find();
    if (!product) {
      return next(customError(404, 'unable to list all products'));
    }
    res.status(200).json({
      status: 'success',
      product,
    });
  } catch (err) {
    next(err);
  }
};

// find a single product controller
export const singleProduct = async (req, res, next) => {
  try {
    const singleProduct = req.params.id;
    const product = await Product.findById(singleProduct);
    if (!product) {
      return next(
        customError(404, `product with id ${singleProduct} does not exist`),
      );
    }
    res.status(200).json({
      status: 'success',
      product,
    });
  } catch (err) {
    next(err);
  }
};

// update a single product controller
export const updateProduct = async (req, res, next) => {
  try {
    const singleProduct = req.params.id;
    let imageNames = [];
    if (req.files) {
      imageNames = req.files.map((file) => file.filename);
    }

    const product = await Product.findByIdAndUpdate(
      singleProduct,
      { $set: req.body, image: imageNames },
      { new: true, runValidators: true },
    );

    if (!product) {
      return next(customError(404, 'Unable to update product'));
    }

    res.status(200).json({
      status: 'success',
      message: `Product ${product.name} updated successfully`,
      product,
    });
  } catch (err) {
    next(err);
  }
};

// delete a single product controller
export const deleteProduct = async (req, res, next) => {
  try {
    const singleProduct = req.params.id;
    const product = await Product.findByIdAndDelete(singleProduct);
    if (!product) {
      return next(
        customError(404, `product with id ${singleProduct} does not exist`),
      );
    }
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

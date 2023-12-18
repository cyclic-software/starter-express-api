import multer from 'multer';
import path from 'path';
import fs from 'fs';

// importing category model
import Category from '../../model/category/category.js';

// import custom error
import customError from '../../utils/error.js';

// multer middle setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!isImage(file.mimetype) || file.size > 10 * 1024 * 1024) {
      return cb(new Error('Invalid file type or size'));
    }

    const dir = `public/images/categories/${req.body.name}`;

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

// create category controller
export const createCategory = async (req, res, next) => {
  try {
    let imageNames 
    if (req.file) {
      imageNames = req.file.filename;
    }

    const newCategory = new Category({
      ...req.body,
      image: imageNames,
    });

    // check if category already exist
    const categoryExist = await Category.findOne({ name: req.body.name });

    if (categoryExist) {
      return next(customError(401, 'category already exist'));
    }
    const category = await newCategory.save();

    res.status(201).json({
      status: 'success',
      message: `category ${category.name} created successfully`,
      category,
    });
  } catch (err) {
    next(err);
  }
};

// list all category controller
export const allCategory = async (req, res, next) => {
  try {
    const category = await Category.find();
    if (!category) {
      return next(customError(400, 'unable to list all category'));
    }
    res.status(200).json({
      status: 'success',
      category,
    });
  } catch (err) {
    next(err);
  }
};

// update a single category controller
export const updateCategory = async (req, res, next) => {
  try {
    const singleCategory = req.params.id;
    let imageNames 
    if (req.file) {
      imageNames = req.file.filename;
    }
    const category = await Category.findByIdAndUpdate(
      singleCategory,
      { $set: req.body, image: imageNames },
      { new: true, runValidators: true },
    );
    if (!category) {
      return next(
        customError(404, `category with id ${singleCategory} does not exist`),
      );
    }
    res.status(200).json({
      status: 'success',
      message: `category ${category.name} updated successfully `,
      category,
    });
  } catch (err) {
    next(err);
  }
};

// find a single category controller
export const singleCategory = async (req, res, next) => {
  try {
    const singleCategory = req.params.id;
    const category = await Category.findById(singleCategory);
    if (!category) {
      return next(
        customError(404, `category with id ${singleCategory} does not exist`)
      );
    }
    res.status(200).json({
      status: "success",
      category,
    });
  } catch (err) {
    next(err);
  }
};

// delete a single category controller
export const deleteCategory = async (req, res, next) => {
  try {
    const singleCategory = req.params.id;
    const category = await Category.findByIdAndDelete(singleCategory);
    if (!category) {
      return next(
        customError(404, `category with id ${singleCategory} does not exist`)
      );
    }
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};



import multer from 'multer';
import Product from '../../model/product/products.js';
import customError from '../../utils/error.js';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/products/');
  },
  filename: function (req, file, cb) {
    // Ensure unique filenames
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname).toLowerCase();
    cb(null, 'product-' + uniqueSuffix + fileExtension);
  },
});

const fileFilter = (req, file, cb) => {
  // Check if the file is an image and has an allowed extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (file.mimetype.startsWith('image/') && allowedExtensions.includes(fileExtension)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only jpg, jpeg, png, and gif files are allowed!'), false); // Reject the file
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
  fileFilter: fileFilter,
});

// create product controller
export const createProduct = async (req, res, next) => {
  try {
    // Extract product details from the request body
    const { name, price, inStock, description, specification, category, shop } = req.body;

    // Extract the image filenames from Multer upload
    const imageFilenames = req.files.map(file => file.filename);

    // Create a new product instance with the extracted details and image filenames
    const newProduct = new Product({
      name,
      price,
      inStock,
      description,
      specification,
      category,
      seller:req.user._id,
      shop,
      image: imageFilenames,
    });

    // Save the new product to the database
    const savedProduct = await newProduct.save();

    // Respond with the saved product details and redirect information
    res.status(201).json({
      status: 'success',
      data: savedProduct,
    });
  } catch (err) {
    // Handle any errors that occurred during the process
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
    res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

// Search product route
// productRoute.get('/search', async (req, res) => {
//   try {
//     const query = req.query.q;
//     const products = await Product.find({
//       $or: [
//         { name: { $regex: new RegExp(query, 'i') } },
//         { brand: { $regex: new RegExp(query, 'i') } },
//         { description: { $regex: new RegExp(query, 'i') } },
//       ],
//     });
//     res.status(200).json({
//       status: 'success',
//       products,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'fail',
//       message: err.message,
//     });
//   }
// });

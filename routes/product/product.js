import express from 'express';
const productRoute = express.Router({ mergeParams: true });

// importing all products controllers
import {
  upload,
  createProduct,
  allProducts,
  singleProduct,
  updateProduct,
  deleteProduct,
} from '../../controller/product/products.js';


// import authorization function
import { protect, restrictTo } from '../../controller/auth/authorize.js';

productRoute.post('/create-product', protect, upload.array('image'), createProduct);


productRoute.get('/all-products', allProducts);
productRoute
  .route('/:id')
  .get(singleProduct)
  .patch(protect, restrictTo('Seller', 'Admin'), upload.array('image'), updateProduct)
  .delete(protect, restrictTo('Seller', 'Admin'), deleteProduct);

export default productRoute;

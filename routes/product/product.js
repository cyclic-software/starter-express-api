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

// importing create order controller on product
import { createCartItem } from '../../controller/cart/cart.js';

// import authorization function
import { protect, restrictTo } from '../../controller/auth/authorize.js';

productRoute.post(
  '/create-product',
  protect,
  upload.array('image', 10),
  createProduct,
);

// route for user to add item to cart
productRoute.post('/:id/add-to-cart', protect, createCartItem);

productRoute.get('/all-products', allProducts);
productRoute
  .route('/:id')
  .get(singleProduct)
  .patch(upload.array('image'), updateProduct)
  .delete(deleteProduct);

export default productRoute;

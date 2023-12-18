import express from 'express';
const cartRoute = express.Router();

import {
  getAllCartProducts,
  getSingleCartProduct,
  updateCartProduct,
  deleteCartProduct,
  getUserCart,
  deleteCart
} from '../../controller/cart/cart.js';

// import authorization function
import { protect } from '../../controller/auth/authorize.js';

// route to get the user's cart
cartRoute.get('/', protect, getUserCart);

// route to get all products in the user's cart
cartRoute.get('/products', protect, getAllCartProducts);

// route to get a single product from the user's cart
cartRoute.get('/products/:productId', protect, getSingleCartProduct);

// route to update a single product in the user's cart
cartRoute.patch('/products/:productId', protect, updateCartProduct);

// route to delete a single product from the user's cart
cartRoute.delete('/products/:productId', protect, deleteCartProduct);

// route to delete the user's cart
cartRoute.delete('/', protect, deleteCart);

export default cartRoute;

import express from 'express';
const shopRoute = express.Router();

// importing all shop controllers
import {
  upload,
  createShop,
  allShops,
  singleShop,
  updateShop,
  deleteShop,
} from '../../controller/shop/shop.js';

// import authorization function
import { protect, restrictTo } from '../../controller/auth/authorize.js';

shopRoute.post('/create-shop', protect, upload.single('image'), createShop);
shopRoute.get('/all-shop', allShops);
shopRoute
  .route('/:id')
  .patch(upload.single('image'), updateShop)
  .get(singleShop)
  .delete(deleteShop);

export default shopRoute;

import express from 'express';
const categoryRoute = express.Router();

// importing all category controllers
import {
  upload,
  createCategory,
  allCategory,
  singleCategory,
  updateCategory,
  deleteCategory,
} from '../../controller/category/category.js';

// import authorization function
import { protect, restrictTo } from '../../controller/auth/authorize.js';

categoryRoute.post(
  '/create-category',
  protect,
  restrictTo('Admin'),
  upload.array('image'),
  createCategory,
);
categoryRoute.get('/all-category', allCategory);
categoryRoute
  .route('/:id')
  .get(singleCategory)
  .patch(protect, restrictTo('Admin'), upload.array('image'), updateCategory)
  .delete(protect, restrictTo('Admin'), deleteCategory);

export default categoryRoute;

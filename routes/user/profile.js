import express from 'express';
const profileRoute = express.Router();

// importing all contacts controllers
import {
  upload,
  getUserData,
  updateUserProfile,
  deactivateAccount,
} from '../../controller/user/profile/profile.js';

// import authorization function
import { protect } from '../../controller/auth/authorize.js';
profileRoute.get('/user', protect, getUserData);
profileRoute.patch(
  '/user/manage-profile/',
  protect,
  upload.single('profile'),
  updateUserProfile,
);
profileRoute.patch('/user/dis-activate', protect, deactivateAccount);

export default profileRoute;

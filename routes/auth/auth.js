import express from 'express';
const authRoute = express.Router();

// importing auth controller
import {
  register,
  registerAdmin,
  registerSeller,
  login,
  verification,
  forgotPassword,
  resetPassword,
} from '../../controller/auth/auth.js';

// import authorization function
import { logout, protect } from '../../controller/auth/authorize.js';

// user signup route
authRoute.post('/sign-up', register);

// seller signup route
authRoute.post('/seller/sign-up', registerSeller);

// admin signup route
authRoute.post('/admin/sign-up', registerAdmin);

// login route
authRoute.post('/sign-in', login);

// logout route
authRoute.get('/logout', logout);

// activate account route
authRoute.patch('/user-activate', protect, verification);

// forgotten password route
authRoute.post('/forget-password', forgotPassword);

// reset password route
authRoute.post('/new-password-reset', resetPassword);

export default authRoute;

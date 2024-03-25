import routes from 'express';
import authControllers from '../controller/auth.controllers.js';

const authRoutes = routes.Router();


//POST Requests
authRoutes.route('/user_sign_up').post(authControllers.signUpUser); //Sign up route /signup

authRoutes.route('/verify_email').get(authControllers.verifyUserEmail); //Verify User Email


authRoutes.route('/user_sign_in').post(authControllers.verifyUser, authControllers.signInUser); //login route

// authRoutes.route('/user_sign_out').post(authControllers.signOutUser).all(authControllers.isAuthenticated)  //Log out Route

//GET Requests

authRoutes.route('/generate_otp').get(authControllers.verifyUser, authControllers.localVariables, authControllers.generateOTP); //Generate OTP

authRoutes.route('/verify_otp').get(authControllers.verifyUser, authControllers.verifyOTP); //Verify OTP


//PUT Requests
authRoutes.route('/reset_user_password').put(authControllers.verifyUser, authControllers.verifyOTP, authControllers.resetUserPassword); //reset password route

export default authRoutes;
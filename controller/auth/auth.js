import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generate } from 'randomstring';

// importing user model
import User from '../../model/user/user.js';

// importing cart model
import Cart from '../../model/cart/cart.js';

// importing custom error
import customError from '../../utils/error.js';

// signup controller for users
export const register = async (req, res, next) => {
  try {
    // Password Validation
    if (!(req.body.password === req.body.Cpassword)) {
      return next(
        customError(404, 'Password does not match with confirm password'),
      );
    }

    // Check if email already exists
    const alreadyExist = await User.findOne({ email: req.body.email });
    if (alreadyExist) {
      return next(customError(401, 'User already exists'));
    }
    // Continue with successful registration process
    const salting = await bcrypt.genSalt(10);
    const hashing = await bcrypt.hash(req.body.password, salting);
    const code_string = generate(6);

    const newUser = new User({
      ...req.body,
      password: hashing,
      code: code_string,
    });

    const user = await newUser.save();

    // Fetch the user's cart
    const cart = await Cart.findOne({ user: user._id });

    // Update the token payload with cart information
    const tokenPayload = {
      id: user._id,
      name: user.name,
      acctType: user.acctType,
      profile: user.profile,
      cart,
    };

    const token = jwt.sign(tokenPayload, process.env.super_token, {
      expiresIn: process.env.token_expires,
    });

    // Send the updated token and user information
    res
      .cookie('key', token, {
        expires: new Date(
          Date.now() + process.env.cookies_exp * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
      })
      .status(201)
      .json({
        status: 'success',
        message: `${user.name} account created successfully`,
        user,
      });
  } catch (err) {
    next(err);
  }
};

// admin signup controller
export const registerAdmin = async (req, res, next) => {
  try {
    // Password Validation
    if (!(req.body.password === req.body.Cpassword)) {
      return next(
        customError(401, 'password does not match with confirm password'),
      );
    }

    // check if email already exist
    const alreadyExist = await User.findOne({ email: req.body.email });
    if (alreadyExist) {
      return next(customError(401, `user already exist`));
    }

    // Continue with successful registration process
    // Rest of the successful registration code
    const salting = await bcrypt.genSalt(10);
    const hashing = await bcrypt.hash(req.body.password, salting);
    const code_string = generate(6);

    const newUser = new User({
      ...req.body,
      password: hashing,
      code: code_string,
      acctType: 'Admin',
    });

    const user = await newUser.save();
    user.password = undefined;
    user.Cpassword = undefined;
    user.code = undefined;
    user.active = undefined;
    user.acctType = undefined;

    // Fetch the user's cart
    const cart = await Cart.findOne({ user: user._id });

    // Update the token payload with cart information
    const tokenPayload = {
      id: user._id,
      name: user.name,
      acctType: user.acctType,
      profile: user.profile,
      cart,
    };

    const token = jwt.sign(tokenPayload, process.env.super_token, {
      expiresIn: process.env.token_expires,
    });

    res
      .cookie('key', token, {
        expires: new Date(
          Date.now() + process.env.cookies_exp * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
      })
      .status(201)
      .json({
        status: 'success',
        message: `${user.name} account created successfully`,
        user,
      });
  } catch (err) {
    next(err);
  }
};

// seller signup controller
export const registerSeller = async (req, res, next) => {
  try {
    // Password Validation
    if (!(req.body.password === req.body.Cpassword)) {
      return next(
        customError(401, 'password does not match with confirm password'),
      );
    }

    // check if email already exist
    const alreadyExist = await User.findOne({ email: req.body.email });
    if (alreadyExist) {
      return next(customError(401, `user already exist`));
    }

    // Continue with successful registration process
    // Rest of the successful registration code
    const salting = await bcrypt.genSalt(10);
    const hashing = await bcrypt.hash(req.body.password, salting);
    const code_string = generate(6);

    const newUser = new User({
      ...req.body,
      password: hashing,
      code: code_string,
      acctType: 'Seller',
    });

    const user = await newUser.save();
    user.password = undefined;
    user.Cpassword = undefined;
    user.code = undefined;
    user.active = undefined;
    user.acctType = undefined;

    // Fetch the user's cart
    const cart = await Cart.findOne({ user: user._id });

    // Update the token payload with cart information
    const tokenPayload = {
      id: user._id,
      name: user.name,
      acctType: user.acctType,
      profile: user.profile,
      cart,
    };

    const token = jwt.sign(tokenPayload, process.env.super_token, {
      expiresIn: process.env.token_expires,
    });

    res
      .cookie('key', token, {
        expires: new Date(
          Date.now() + process.env.cookies_exp * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
      })
      .status(201)
      .json({
        status: 'success',
        message: `${user.name} account created successfully`,
        user,
      });
  } catch (err) {
    next(err);
  }
};

// login controller
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      '+password',
    );

    if (!user) {
      return next(customError(404, 'user does not exist'));
    }

    const checkPassword = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!checkPassword) {
      return next(customError(401, 'incorrect login credentials'));
    }

    if (!user.active) {
      return next(customError(401, `${user.name} account not activated`));
    }

    user.password = undefined;
    user.isAdmin = undefined;
    user.isDeliveryCrew = undefined;
    user.code = undefined;
    user.active = undefined;

    // Fetch the user's cart
    const cart = await Cart.findOne({ user: user._id });

    // Update the token payload with cart information
    const tokenPayload = {
      id: user._id,
      name: user.name,
      acctType: user.acctType,
      profile: user.profile,
      cart,
    };

    const token = jwt.sign(tokenPayload, process.env.super_token, {
      expiresIn: process.env.token_expires,
    });

    res
      .cookie('key', token, {
        expires: new Date(
          Date.now() + process.env.cookies_exp * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
      })
      .status(201)
      .json({
        status: 'success',
        message: `Welcome Back ${user.name}`,
        user,
      });
  } catch (err) {
    next(err);
  }
};

// account verification controller
export const verification = async (req, res, next) => {
  try {
    // Get the logged-in user
    const loggedInUser = req.user;

    // Check if the code in the request matches the code of the logged-in user
    if (loggedInUser.code !== req.body.code) {
      return next(customError(403, 'wrong activation code'));
    } else {
      const user = await User.findOneAndUpdate(
        { _id: loggedInUser._id },
        { active: true },
        { new: true, runValidators: true },
      );

      if (!user) {
        return next(customError(401, 'Unable to activate account'));
      } else {
        user.password = undefined;
        user.isAdmin = undefined;
        user.isDeliveryCrew = undefined;
        user.code = undefined;
        user.active = undefined;

        res.status(200).json({
          status: 'success',
          message: `${user.name} account activated successfully`,
          user,
        });
        return;
      }
    }
  } catch (err) {
    next(err);
  }
};

// forgotten password controller
export const forgotPassword = async (req, res, next) => {
  try {
    // Find user with the provided email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(
        customError(404, `user with email ${req.body.email} does not exist`),
      );
    }

    // Generate a reset code
    const resetCode = generate(6);

    // Update user's resetPasswordToken with the generated reset code
    user.resetPasswordToken = resetCode;
    await user.save();

    // Here you would send an email to the user with the reset code
    // You can use a library like nodemailer for this

    res.status(200).json({
      status: 'success',
      message: `Reset code has been sent to ${user.email}`,
    });
  } catch (err) {
    next(err);
  }
};

// reset password controller
export const resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.body.resetPasswordToken,
    }).select('+password');

    if (!user) {
      return next(customError(404, 'wrong reset password token!'));
    }

    if (!(req.body.password === req.body.Cpassword)) {
      return next(
        customError(404, 'password does not match with confirm password'),
      );
    }

    const salting = await bcrypt.genSalt(10);
    const hashing = await bcrypt.hash(req.body.password, salting);

    user.password = hashing;
    user.resetPasswordToken = undefined;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.super_token, {
      expiresIn: process.env.token_expires,
    });

    res
      .cookie('key', token, {
        expires: new Date(
          Date.now() + process.env.cookies_exp * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
      })
      .status(200)
      .json({
        status: 'success',
        message: `Password has been reset successfully for ${user.email}`,
      });
  } catch (err) {
    next(err);
  }
};

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generate } from 'randomstring';

// importing user model
import User from '../../model/user/user.js';

// importing custom error
import customError from '../../utils/error.js';

// signup controller for users
export const register = async (req, res, next) => {
  try {
    if (!(req.body.password === req.body.Cpassword)) {
      return next(
        customError(401, 'password does not match with confirm password'),
      );
    }

    const salting = await bcrypt.genSalt(10);
    const hashing = await bcrypt.hash(req.body.password, salting);

    const code_string = generate(6);

    const newUser = new User({
      ...req.body,
      password: hashing,
      code: code_string,
    });

    const alreadyExist = await User.findOne({ email: newUser.email });
    if (alreadyExist) {
      return next(customError(401, `user with ${newUser.email} already exist`));
    }

    const user = await newUser.save();
    user.password = undefined;
    user.Cpassword = undefined;
    user.code = undefined;
    user.active = undefined;

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
      .status(201)
      .json({
        status: 'success',
        message: `User ${user.name} Account Created successfully`,
        user,
      });
  } catch (err) {
    next(err);
  }
};

// admin signup controller
export const registerSeller = async (req, res, next) => {
  try {
    if (!(req.body.password === req.body.Cpassword)) {
      return next(
        customError(401, 'password does not match with confirm password'),
      );
    }

    const salting = await bcrypt.genSalt(10);
    const hashing = await bcrypt.hash(req.body.password, salting);

    const code_string = generate(6);

    const newUser = new User({
      ...req.body,
      password: hashing,
      code: code_string,
      acctType: 'Seller', // set account type to 'Seller'
    });

    const alreadyExist = await User.findOne({ email: newUser.email });
    if (alreadyExist) {
      return next(customError(401, `user with ${newUser.email} already exist`));
    }

    const user = await newUser.save();
    user.password = undefined;
    user.Cpassword = undefined;
    user.code = undefined;
    user.active = undefined;

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
      .status(201)
      .json({
        status: 'success',
        message: `User ${user.name} Account Created successfully`,
        user,
      });
  } catch (err) {
    next(err);
  }
};

// seller signup controller
export const registerAdmin = async (req, res, next) => {
  try {
    if (!(req.body.password === req.body.Cpassword)) {
      return next(
        customError(401, 'password does not match with confirm password'),
      );
    }

    const salting = await bcrypt.genSalt(10);
    const hashing = await bcrypt.hash(req.body.password, salting);

    const code_string = generate(6);

    const newUser = new User({
      ...req.body,
      password: hashing,
      code: code_string,
      acctType: 'Admin', // set account type to 'Admin'
    });

    const alreadyExist = await User.findOne({ email: newUser.email });
    if (alreadyExist) {
      return next(customError(401, `user with ${newUser.email} already exist`));
    }

    const user = await newUser.save();
    user.password = undefined;
    user.Cpassword = undefined;
    user.code = undefined;
    user.active = undefined;

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
      .status(201)
      .json({
        status: 'success',
        message: `User ${user.name} Account Created successfully`,
        user,
      });
  } catch (err) {
    next(err);
  }
};

// login controller
// export const login = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ email: req.body.email }).select(
//       '+password',
//     );
//     if (!user) {
//       return next(customError(404, 'user does not exist'));
//     }
//     const checkPassword = await bcrypt.compare(
//       req.body.password,
//       user.password,
//     );
//     if (!checkPassword) {
//       return next(customError(401, 'incorrect login credentials'));
//     }

//     user.password = undefined;
//     user.isAdmin = undefined;
//     user.isDeliveryCrew = undefined;
//     user.code = undefined;
//     user.active = undefined;

//     const token = jwt.sign(
//       {
//         id: user._id,
//         isAdmin: user.isAdmin,
//         isDeliveryCrew: user.isDeliveryCrew,
//       },
//       process.env.super_token,
//       {
//         expiresIn: process.env.token_expires,
//       },
//     );

//     res
//       .cookie('key', token, {
//         expires: new Date(
//           Date.now() + process.env.cookies_exp * 24 * 60 * 60 * 1000,
//         ),
//         httpOnly: true,
//       })
//       .status(201)
//       .json({
//         status: 'success',
//         message: `Welcome Back ${user.name}`,
//         user,
//       });
//   } catch (err) {
//     next(err);
//   }
// };

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

    // Check if user account is active
    if (!user.active) {
      // Redirect to 'user-activate' route
      // return res.redirect('/user-activate');
      return next(customError(401, 'user not activated'));
    }

    user.password = undefined;
    user.isAdmin = undefined;
    user.isDeliveryCrew = undefined;
    user.code = undefined;
    user.active = undefined;

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        isDeliveryCrew: user.isDeliveryCrew,
      },
      process.env.super_token,
      {
        expiresIn: process.env.token_expires,
      },
    );

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
    }

    const user = await User.findOneAndUpdate(
      { code: req.body.code },
      { active: true },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(customError(401, 'Unable to activate account'));
    }

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
      return res.status(400).json({
        error: `User with ${req.body.email} does not exist`,
      });
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
      return next(customError(404, 'invalid reset code'));
    }

    if (!(req.body.password === req.body.Cpassword)) {
      return next(
        customError(401, 'password does not match with confirm password'),
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

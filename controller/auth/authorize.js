import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../../model/user/user.js';
import customError from '../../utils/error.js';

export const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.key) {
      token = req.cookies.key;
    }

    if (!token) {
      return next(
        customError(401, 'You are not logged in! Please log in to get access.'),
      );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.super_token);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        customError(401, 'The user belonging to this token no longer exist.'),
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
};

export const restrictTo = (...acctType) => {
  return (req, res, next) => {
    // acctType ['buyer', 'seller', "DeliveryCrew", "admin"]. acctType='user'
    if (!acctType.includes(req.user.acctType)) {
      return next(
        customError(403, 'You do not have permission to perform this action'),
      );
    }
    next();
  };
};

// logout controller
export const logout = async (req, res, next) => {
  try {
    // 1) Clear the cookie that stores the token
    res.cookie('key', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    // 2) Send a JSON response with a status code of 200 (ok), a status message of 'success', and a message saying 'Logged out successfully'
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });

    // 3) Redirect to the index page
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

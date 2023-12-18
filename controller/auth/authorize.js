import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import User from '../../model/user/user.js';
import customError from '../../utils/error.js';
import Cart from '../../model/cart/cart.js';

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

    // 2) Redirect to the index page
    res.redirect('/cidar/technology/auth/login');
  } catch (err) {
    next(err);
  }
};

// authenticated route
// export function authenticateToken(req, res, next) {
//   const token = req.cookies.key;

//   if (token != null) {
//     jwt.verify(token, process.env.super_token, async (err, user) => {
//       if (!err) {
//         req.user = user;
//         res.locals.user = user;

//         // Retrieve the user's cart
//         try {
//           const cart = await Cart.findOne({ user: user._id });
//           req.cart = cart;
//         } catch (err) {
//           next(err)
//         }
//       }
//       next();
//     });
//   } else {
//     next();
//   }
// }
// Authenticate user token and retrieve cart information

// authenticated route

// authenticated route
export async function authenticateToken(req, res, next) {
  // Check for token presence
  const token = req.cookies.key;

  if (!token) {
    next();
    return;
  }

  try {
    // Verify JWT token and extract user ID
    const decoded = jwt.verify(token, process.env.super_token);
    const userId = decoded.id;

    // Find user based on ID
    const currentUser = await User.findById(userId);

    // Check if token is valid and user exists
    if (!currentUser) {
      return res
        .status(401)
        .json({ message: 'Invalid token or User not found' });
    }

    // Check if token has expired
    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ message: 'Token expired' });
    }

    // Retrieve user's cart
    let cartItem = await Cart.findOne({ user: currentUser._id });

    if (!cartItem) {
      // Handle case where no cart is found
      // Initialize an empty cart
      cartItem = new Cart({ user: currentUser._id });
    }

    // Prepare empty array for cart items
    const cartItems = [];

    // Check for empty products array
    if (cartItem.products.length > 0) {
      // Iteratively add each item to the array
      for (const item of cartItem.products) {
        cartItems.push(item);
      }
    }

    // Add user and cart information to request object
    const userObject = {
      currentUser,
      cartItem,
    };

    req.user = userObject.currentUser;
    res.locals.user = userObject.currentUser;

    req.cart = userObject.cartItem;
    res.locals.cart = userObject.cartItem;

    next();
  } catch (error) {
    // Handle token verification errors
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      next(error);
    }
  }
}

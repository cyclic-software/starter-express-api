import multer from 'multer';

// impporting user schema
import User from '../../../model/user/user.js';

// import custom error function
import customError from '../../../utils/error.js';

import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!isImage(file.mimetype) || file.size > 10 * 1024 * 1024) {
      return cb(new Error('Invalid file type or size'));
    }

    const dir = `public/images/profile/${req.user._id}`;

    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, (error) => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: (req, file, cb) => {
    const fileName = path.parse(file.originalname).name;
    const extension = path.parse(file.originalname).ext;
    cb(null, `${fileName}${Date.now()}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!isImage(file.mimetype)) {
    return cb(new Error('Invalid file type, image only!'));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

function isImage(mimeType) {
  const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  return imageMimeTypes.includes(mimeType);
}

// render user profile
export const getUserData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(customError(404, 'User not found'));
    }

    user.acctType = undefined;
    user.code = undefined;
    user.active = undefined;

    res.status(200).json({
      status: 'success',
      message: 'User profile fetched successfully',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// update user profile
export const updateUserProfile = async (req, res, next) => {
  let error;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      error = customError(404, 'User not found');
      res.status(error.status).json({
        status: 'error',
        message: error.message,
      });
      return;
    }

    // Check if the user is authorized to update the profile
    if (req.user.id !== user.id) {
      error = customError(403, 'You are not authorized to update this profile');
      res.status(error.status).json({
        status: 'error',
        message: error.message,
      });
      return;
    }

    let updateObject = req.body;

    // Check if there is an image to update
    if (req.file) {
      updateObject = { ...updateObject, profile: req.file.filename };
    }

    // Loop over the updates and apply them to the user
    Object.keys(updateObject).forEach((update) => {
      user[update] = updateObject[update];
    });

    // Save the updated user
    await user.save();

    user.acctType = undefined;
    user.code = undefined;
    user.active = undefined;

    res.status(200).json({
      status: 'success',
      message: 'User profile updated successfully',
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

// deactivate user profile
export const deactivateAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(customError(404, 'User not found'));
    }

    // Set the 'active' field to false
    user.active = false;

    // Save the updated user
    await user.save();
    user.acctType = undefined;
    user.code = undefined;
    user.active = undefined;

    res.status(200).json({
      status: 'success',
      message: 'User account deactivated successfully',
      user,
    });
  } catch (err) {
    next(err);
  }
};

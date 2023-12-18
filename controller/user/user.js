// importing user schema
import User from "../../model/user/user.js";

// import custom error
import customError from "../../utils/error.js";



export const listAllUsers = async (req, res, next) => {
    try {
      const users = await User.find({});
      if (!users) {
        return next(customError(400, "unable to list all users"));
      }
      res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
          users,
        },
      });
    } catch (err) {
      next(err);
    }
};

export const listInactiveUsers = async (req, res, next) => {
    try {
      const inactiveUsers = await User.find({ active: false });
      if (!inactiveUsers) {
        return next(customError(400, "unable to list all in active users"));
      }
      res.status(200).json({
        status: 'success',
        results: inactiveUsers.length,
        data: {
          inactiveUsers,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  // find a specific user
  export const findUserById = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return next(customError(404, `No user found with ID ${req.params.id}`));
      }
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err) {
      next(err);
    }
  };
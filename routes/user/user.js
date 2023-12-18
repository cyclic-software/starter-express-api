import express from 'express';
const usersRoute = express.Router();

// importing all category controllers
import {
  listAllUsers,
  listInactiveUsers,
  findUserById,
} from '../../controller/user/user.js';

// import authorization function
import { protect, restrictTo } from '../../controller/auth/authorize.js';

usersRoute.get('/all-users', protect, restrictTo('Admin'), listAllUsers);
usersRoute.get(
  '/all-in-active-users',
  protect,
  restrictTo('Admin'),
  listInactiveUsers,
);
usersRoute.route('/:id').get(protect, restrictTo('Admin'), findUserById);

export default usersRoute;

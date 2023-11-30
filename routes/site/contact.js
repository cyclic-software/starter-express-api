import express from 'express';
const contactRoute = express.Router();

// importing all contacts controllers
import {
  createMessage,
  allMessage,
  singleMessage,
  updateMessage,
  deleteMessage,
} from '../../controller/site/contact.js';

// import authorization function
import {
  protect,
  restrictTo,
} from '../../controller/auth/authorize.js';

contactRoute.post('/', createMessage);
contactRoute.get('/all-messages', protect, restrictTo('Admin'), allMessage);
contactRoute
  .route('/:id')
  .get(protect, restrictTo('Admin'), singleMessage)
  .patch(protect, protect, restrictTo('Admin'), updateMessage)
  .delete(protect, protect, restrictTo('Admin'), deleteMessage);

export default contactRoute;

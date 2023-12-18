import express from 'express';
const contactRoute = express.Router();

// importing all contacts controllers
import {
  createMessage,
  allMessage,
  singleMessage,
  deleteMessage,
} from '../../controller/site/contact.js';

// import authorization function
import { protect, restrictTo } from '../../controller/auth/authorize.js';

contactRoute.post('/create-message', createMessage);
contactRoute.get('/contact-messages', allMessage);
contactRoute
  .route('/contact-message/:id')
  .get(singleMessage)
  .delete(deleteMessage);

export default contactRoute;

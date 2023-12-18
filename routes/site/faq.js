import express from 'express';
const faqRoute = express.Router();

// importing all contacts controllers
import {
  createFaq,
  allFaq,
  singleFaq,
  updateFaq,
  deleteFaq
} from '../../controller/site/faq.js';


// import authorization function
import {
  protect,
  restrictTo,
} from '../../controller/auth/authorize.js';

faqRoute.post('/create-faq',  createFaq);
// list all faq to user
faqRoute.get('/', allFaq);

faqRoute
  .route('/:id')
  .get(singleFaq)
  .patch(updateFaq)
  .delete(deleteFaq)

export default faqRoute;

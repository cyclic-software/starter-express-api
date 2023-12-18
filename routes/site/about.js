import express from 'express';
const aboutRoute = express.Router();

// importing all contacts controllers
import {
  createAbout,
  allAbout,
  singleAbout,
  updateAbout,
  deleteAbout
} from '../../controller/site/about.js';

// import authorization function
import { protect, restrictTo } from '../../controller/auth/authorize.js';

aboutRoute.post('/create-story',  createAbout);
aboutRoute.get('/', allAbout);
aboutRoute
  .route('/:id')
  .get(singleAbout)
  .patch(updateAbout)
  .delete(deleteAbout)

export default aboutRoute;

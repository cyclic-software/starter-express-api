import express from 'express';
const siteRoute = express.Router();

// products controller importation
import {
  homepage,
} from '../../controller/site/site.js';

import { protect, authenticateToken } from '../../controller/auth/authorize.js';


// homepage
siteRoute.get('/index', homepage);



export default siteRoute;

import express from 'express';
const policyRoute = express.Router();

// importing all contacts controllers
import {
  createPolicy,
  allPolicy,
  singlePolicy,
  updatePolicy,
  deletePolicy,
} from '../../controller/site/policy.js';

// import authorization function
import { protect, restrictTo } from '../../controller/auth/authorize.js';

policyRoute.post('/create-policy', createPolicy);
policyRoute.get('/', allPolicy);
policyRoute
  .route('/:id')
  .get(singlePolicy)
  .patch(updatePolicy)
  .delete(deletePolicy);

export default policyRoute;

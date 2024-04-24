import { Router } from 'express';
import {
  CreateCartItem,
  DeleteCartItem,
  ReadCartItems,
  ReadCartItem,
  UpdateCartItem,
} from '../../controllers/CartItemController.js';
const router = Router();

router.get('/list/cartitems', ReadCartItems);
router.post('/create/cartitem', CreateCartItem);
router.get('/list/caritem/:id', ReadCartItem);
router.put('/update/caritem/:id', UpdateCartItem);
router.delete('/delete/caritem/:id', DeleteCartItem);

export { router as RouteCartItems };

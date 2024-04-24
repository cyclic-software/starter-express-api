import { Router } from "express";
import { CreateCart, DeleteCart, ReadCart, ReadCarts } from "../../controllers/CartController.js";
const router = Router();

router.get('/list/cart', ReadCarts);
router.post('/create/cart/:userId', CreateCart);
router.get('/list/cart/:id', ReadCart);
router.delete('/delete/cart/:id', DeleteCart);

export {router as RouteCart};
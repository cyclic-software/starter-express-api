import { Router } from "express";
import {} from "../../controllers/CategoryController.js"
import { CreateProduct } from "../../controllers/ProductController.js";
const router = Router();

router.get('');
router.post('/create/product', CreateProduct);
router.get('');
router.put('');
router.delete('');

export {router as RouteProduct}
import { Router } from "express";
import { CreateStock } from "../../controllers/StockController.js";
const router = Router();

router.get('');
router.post('/create/stock', CreateStock);
router.get('');
router.put('');
router.delete('');

export {router as RouteStock}
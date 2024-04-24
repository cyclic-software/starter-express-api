import { Router } from "express";
import { CreateAccess } from "../../controllers/AcessController.js";
const router = Router();

router.get('');
router.post('/create/acess', CreateAccess);
router.get('');
router.put('');
router.delete('');

export {router as RouteAcess};
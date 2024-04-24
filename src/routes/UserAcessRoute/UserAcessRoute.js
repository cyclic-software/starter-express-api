import { Router } from "express";
import {} from "../../controllers/CategoryController.js"
import { CreateAccess } from "../../controllers/UserAcessController.js";
const router = Router();

router.get('');
router.post('create/useracess/:userId/:accessId', CreateAccess);
router.get('');
router.put('');
router.delete('');


export {router as RouteUserAcess};
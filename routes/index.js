import Express from "express";

import { 
    getDotaInfo, 
    getHome 
} from "../controllers/dotaController.js";

const router = Express.Router();


router.get('/', getHome);

router.get('/dota/:channel_id', getDotaInfo);


export default router;
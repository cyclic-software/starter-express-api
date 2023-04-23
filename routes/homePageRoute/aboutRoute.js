import express from "express";
import * as aboutController from '../../controllers/homePageController/aboutController.js';


const router = express.Router();

router.route('/').post(aboutController.createAbout)

export default router;
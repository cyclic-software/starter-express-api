import express from "express";
import * as slideController from "../controllers/slideController.js";


const router = express.Router();



router.route("/").post(slideController.createSlide);
router.route("/").get(slideController.getAllSlide);
router.route("/:id").get(slideController.getASlideItem);

export default router;
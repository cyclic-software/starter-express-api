import express from "express";
import * as newsController from "../controllers/newsController.js";


const router = express.Router();

router.route("/").post(newsController.createNews);
router.route("/").get(newsController.getAllNews)
router.route("/:id").get(newsController.getNewsDetail)

export default router
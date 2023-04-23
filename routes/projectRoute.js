import express from "express";
import * as projectController from "../controllers/projectController.js";


const router = express.Router();



router.route("/").post(projectController.createProject);
router.route("/").get(projectController.getAllProjects);
router.route("/:id").get(projectController.getAProject);



export default router;
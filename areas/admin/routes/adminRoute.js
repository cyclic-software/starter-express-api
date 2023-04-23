import express from "express";
import * as adminController from "../controllers/AdminController.js";



const router = express.Router();



router.route("/").get(adminController.getIndexPage);




export default router;
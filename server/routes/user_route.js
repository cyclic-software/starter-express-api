import express from "express";
import { getUserInfo, updateUserInfo } from "../controllers/user_controller.js";
const router = express.Router();

router.get("/", getUserInfo);
router.post("/", updateUserInfo);

export default router;

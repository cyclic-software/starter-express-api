import express from "express";
import { signIn, signUp, signOut } from "../controllers/auth_controller.js";
const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);
router.post("/sign-out", signOut);

export default router;

import express from "express"
import { registerController } from "../controllers/authController.js"

export const authRouter=express.Router()

authRouter.post("/register",registerController)


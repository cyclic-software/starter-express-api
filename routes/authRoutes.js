import express from "express"
import { registerController,loginController } from "../controllers/authController.js"
import { requireSignin ,isAdmin} from "../middlewares/authMiddleware.js"

export const authRouter=express.Router()

authRouter.post("/register",registerController)

authRouter.post("/login",loginController)

authRouter.get('/authenticate',requireSignin,((req,res)=>{
    res.status(200).send({ok:true})
}))

authRouter.post("/admin-auth",requireSignin,isAdmin,(req,res)=>{
    res.status(200).send({
        ok:true
    })
})
authRouter.get("/",(req,res)=>{
    res.send("auth routes")
})

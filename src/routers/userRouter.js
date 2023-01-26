import express from "express";
import { see , getEdit,postEdit, remove, logout, naverLogin, naverCallback, getChangePassword, postChangePassword, postCheck, getCheck, postCertification,} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, avatarFiles } from "../middlewares";

const userRouter = express.Router();

userRouter.route("/certifications").post(postCertification);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarFiles.single("avatar"),postEdit);
userRouter.route("/check").get(getCheck).post(postCheck);
userRouter.route("/logout").all(protectorMiddleware).get(logout);
userRouter.route("/naverLogin").all(publicOnlyMiddleware).get(naverLogin); 
userRouter.route("/callback").all(publicOnlyMiddleware).get(naverCallback); 
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.route("/delete").get(remove);
userRouter.route("/:id([0-9a-f]{24})").get(see);

export default userRouter;
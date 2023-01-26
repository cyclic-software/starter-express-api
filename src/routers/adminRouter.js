import express from "express";
import { getAdminLogin, getAdminPage, postAdminLogin } from "../controllers/adminContoller";
import { adminOnlyMiddleware } from "../middlewares";

const adminRouter = express.Router();

adminRouter.route("/").all(adminOnlyMiddleware).get(getAdminPage)
adminRouter.route("/login").get(getAdminLogin).post(postAdminLogin);

export default adminRouter;
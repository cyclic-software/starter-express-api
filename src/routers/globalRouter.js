import express from "express";
import { home,search } from "../controllers/boardController";
import { getJoin,getLogin, postJoin, postLogin } from "../controllers/userController";
import { publicOnlyMiddleware } from "../middlewares";
const globalRouter = express.Router();

globalRouter.get("/",home);
globalRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
globalRouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);
globalRouter.get("/search",search);

export default globalRouter;
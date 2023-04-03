import { Route } from "@core/interface";
import { Router } from "express";
import AuthController from "./auth.controller";
import { authMiddleware } from "@core/middleware";
class AuthRoute implements Route {
    public path = '/api/auth';
    public router = Router();
    public authController = new AuthController();

    constructor() {
        this.initializeRoute();
    }

    private initializeRoute() {
        this.router.post(this.path, this.authController.login)
        this.router.get(this.path, authMiddleware, this.authController.getCurrentLoginUser)
    }
}

export default AuthRoute;
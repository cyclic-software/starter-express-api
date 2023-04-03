import { NextFunction, Request, Response } from "express";
import AuthService from "./auth.service";
import AuthDto from "./auth.dto";
import { TokenData } from "@modules/auth";

class AuthController {
    private authService = new AuthService();
    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const model: AuthDto = req.body;
            const tokenData: TokenData = await this.authService.login(model);
            res.status(200).json(tokenData);
        } catch (err) {
            next(err);
        }
    }

    public getCurrentLoginUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.authService.getCurrentLoginUser(req.user.id);
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }
}
export default AuthController;
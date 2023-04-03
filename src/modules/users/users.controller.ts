import { NextFunction, Request, Response, request } from "express";
import UserService from "./users.service";
import RegisterDto from "./dtos/register.dto";
import { TokenData } from "@modules/auth";
import IUser from "./users.interface";
import { IPagination } from "@core/interface";

class UserController {
    private userService = new UserService();
    public register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const model: RegisterDto = req.body;
            const tokenData: TokenData = await this.userService.createUser(model);
            res.status(201).json(tokenData)
        } catch (err) {
            next(err);
        }
    }

    public getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user: IUser = await this.userService.getUserById(req.params.id);
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }

    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const model: RegisterDto = req.body;
            const user: IUser = await this.userService.updateUser(req.params.id, model);
            res.status(200).json(user)
        } catch (err) {
            next(err);
        }
    }

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users: Array<IUser> = await this.userService.getAll();
            res.status(200).json(users)
        } catch (err) {
            next(err);
        }
    }

    public getAllPaging = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page: number = Number(req.params.page);
            const keyword: string = req.query.keyword?.toString() || "";
            const users: IPagination<IUser> = await this.userService.getAllPaging(keyword, page);
            res.status(200).json(users);
        } catch (err) {
            next(err);
        }
    }

}
export default UserController;
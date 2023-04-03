import { NextFunction, Request, Response } from "express";

class IndexController {
    public index = (req: Request, res: Response, next: NextFunction) => {
        try {
            res.status(200).json('Hello');
        } catch (err) {
            next(err);
        }
    }
}
export default IndexController;
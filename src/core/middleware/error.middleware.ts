import { HttpException } from "@core/exceptions";
import { Logger } from "@core/utils";
import { NextFunction, Request, Response } from "express";

const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    const status: number = error.status || 500
    const message = error.message || "Something went wrong";

    Logger.error(`[Error] - Status: ${status} - Message: ${message}`);
    res.status(status).json({ message: message });
}

export default errorMiddleware;
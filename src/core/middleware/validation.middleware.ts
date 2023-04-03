import { RequestHandler } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { HttpException } from "@core/exceptions";
const ValidationMiddleware = (type: any, skipMissingProperties: boolean): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        validate(plainToClass(type, req.body), { skipMissingProperties }).then((errors: ValidationError[]) => {
            if (errors.length > 0) {
                const messages = errors.map((error: ValidationError) => {
                    return Object.values(error.constraints!);
                }).join(', ');
                console.log(messages);
                next(new HttpException(400, messages));
            } else {
                next();
            }
        })
    }
}
export default ValidationMiddleware;
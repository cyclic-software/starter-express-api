import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis';


export async function checkBlacklist(req: Request, res: Response, next: NextFunction) {
    const tokenToCheck = await redisClient.get("puppeteerToken") // Assuming the token is in the 'Authorization' header
    console.log(tokenToCheck);
    if (!tokenToCheck) {
        return res.status(401).json({ message: 'Unauthorized, please login' });
    }

    // Check if the token is in the blacklist
    const isInBlacklist = await redisClient.lRange('blacklist', 0, -1)
        .then((blacklist: string[]) => blacklist.includes(tokenToCheck));

    if (isInBlacklist) {
        return res.status(401).json({ message: 'Token is blacklisted' });
    }

    next();
}
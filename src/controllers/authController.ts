// backend/src/controllers/userController.ts
import { Request, Response } from 'express';
import UserModel from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { scrapeTextFromPage } from '../puppeteerHelper';
import { getChatGPTSummary } from '../chatGPTHelper';
import redisClient from '../config/redis';

export async function registerUser(req: Request, res: Response): Promise<void> {
    try {
        const { username, email, password } = req.body;

        // Check if the user with the provided email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'User with this email already exists' });
            return;
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await UserModel.create({
            username,
            email,
            password: hashedPassword,
        });
        res.status(201).json({ user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function loginUser(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;

        // Check if the user with the provided email exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(401).json({ error: 'Invalid email' });
            return;
        }

        // Check if the provided password matches the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Invalid password' });
            return;
        }

        // Generate a JWT token for authentication
        const token =await jwt.sign({ userId: user._id }, 'JWTSECREAT', { expiresIn: '1h' });
        await redisClient.set('puppeteerToken',token,{EX:60*5})
        res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
export async function logout(req: Request, res: Response) {
    const tokenToBlacklist = await redisClient.get("puppeteerToken");

    if (!tokenToBlacklist) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Add the token to the blacklist
    await redisClient.rPush('blacklist', tokenToBlacklist);

    res.send('Please login again');
}
export async function generateSummary(req: Request, res: Response): Promise<void> {
    const { url } = req.body;

    try {
        const scrapedText = await scrapeTextFromPage(url);
        const summary = await getChatGPTSummary(scrapedText);

        res.json({ summary });
    } catch (error) {
        console.error('Error generating summary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}




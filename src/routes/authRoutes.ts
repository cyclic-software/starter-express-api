// backend/src/routes/userRoutes.ts
import express, { Router } from 'express';
import { registerUser, loginUser, generateSummary, logout } from '../controllers/authController';
import { checkBlacklist } from '../middleware/middleware';

const router: Router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get("/logout",logout)
router.post('/generateSummary',checkBlacklist, generateSummary);

export default router;

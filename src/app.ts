import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db'; 
import rateLimiter from './middleware/rateLimiter';
import userRoutes from './routes/authRoutes'; // Assuming you have user routes
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(rateLimiter);
// Connect to MongoDB
connectDB();


// Use user routes
app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

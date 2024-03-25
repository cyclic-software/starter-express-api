import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
// import bodyParser from 'body-parser';

import dbConn from './app/config/database.js';
import authRoutes from './app/routers/auth.routes.js';
import userRoutes from './app/routers/users.routes.js';
import tripRoutes from './app/routers/trip.routes.js';

const app = express();

dotenv.config();

app.use(cors());

// initialize middlewares

//define port 
const port = process.env.PORT || 8090;

app.use(express.json());
app.use(morgan('combined'));
app.disable('x-powered-by');

app.use(express.urlencoded({ extended: true}));

//authentication route
app.use('/api/auth', authRoutes);

// app.use(function(req, res, next) {
//   if (!req.headers.authorization) {
//     return res.status(403).json({ error: 'You must be logged In' });
//   }
//   next();
// });

//define routers of the application
app.use('/api/users', userRoutes);

//Trips routes
app.use('/api/trips', tripRoutes);

dbConn().then(app.listen(port))
    .then(()=>console.log(`Connection to server established on port ${port}`)).catch((err)=>console.log(err));


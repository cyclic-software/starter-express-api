import express from 'express';
const app = express();

import bodyParser from 'body-parser';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { fileURLToPath } from 'url';
import path from 'path';

import customError from './utils/error.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.port || 4000;

// connecting to database
import mongoose from 'mongoose';
const db = process.env.connection_string;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('mongoose database connected successfully');
  })
  .catch(() => {
    console.log('unable to connect to mongoose database');
  });

import cookieParser from 'cookie-parser';

// setting up middleware
app.use(express.json());
app.use(cookieParser());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cors());

// handling error middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 'Server Error';
  const errorType = err.type || 'General';
  const errorStack = process.env.NODE_ENV === 'development' ? err.stack : {};

  // Handle different error types
  if (errorType === 'DatabaseError') {
    // Handle database error
    console.error('Database error: ', errorMessage);
  } else if (errorType === 'ValidationError') {
    // Handle validation error
    console.error('Validation error: ', errorMessage);
  } else {
    // Handle general error
    console.error('Error: ', errorMessage);
  }

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    type: errorType,
    stack: errorStack,
  });
});

// Set views value to specify the folder we want to use for our views
app.set('views', path.join(__dirname, 'views'));

// Set view engine as EJS
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// cidar technology routes importation
// importing site route
import siteRoute from './routes/site/site.js';
app.use('/luckybuystore/', siteRoute);

// importing contact message route
import contactRoute from './routes/site/contact.js';
app.use('/luckybuystore/contact-us/', contactRoute);

// importing faq route
import faqRoute from './routes/site/faq.js';
app.use('/luckybuystore/faq/', faqRoute);

// importing policy route
import policyRoute from './routes/site/policy.js';
app.use('/luckybuystore/policy/', policyRoute);

// importing policy route
import aboutRoute from './routes/site/about.js';
app.use('/luckybuystore/about/', aboutRoute);

// importing authentication route
import authRoute from './routes/auth/auth.js';
app.use('/luckybuystore/auth/', authRoute);

// importing user profile route
import profileRoute from './routes/user/profile.js';
app.use('/luckybuystore/auth/profile/', profileRoute);

// importing user routes
import usersRoute from './routes/user/user.js';
app.use('/luckybuystore/auth/users/', usersRoute);

// importing category route
import categoryRoute from './routes/category/category.js';
app.use('/luckybuystore/category/', categoryRoute);

// importing product route
import productRoute from './routes/product/product.js';
app.use('/luckybuystore/product/', productRoute);

// importing cart route
import cartRoute from './routes/cart/cart.js';
app.use('/luckybuystore/cart/', cartRoute);

// importing order route
import orderRoute from './routes/order/order.js';
app.use('/luckybuystore/order/', orderRoute);

// importing shop route
import shopRoute from './routes/shop/shop.js';
app.use('/luckybuystore/shop/', shopRoute);

app.get('/', async (req, res, next) => {
  try {
    return res.redirect('/luckybuystore/index');
    res.status(200);
  } catch (err) {
    next(err);
  }
});

app.all('*', async (req, res, next) => {
  try {
    return next(customError(404, '<h4> Page Not Found </h4>'));
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(
    `${process.env.site_name} server started successfully on ${PORT}`,
  );
});

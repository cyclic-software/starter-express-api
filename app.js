import express from 'express';
const app = express();

import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const port = process.env.port || 4040;

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

// creating error middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 'Server Error';
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// routes importation
// importing site route
import siteRoute from './routes/site/site.js';
app.use('/api/luckybuystore/', siteRoute);

// importing contact message route
import contactRoute from './routes/site/contact.js';
app.use('/api/luckybuystore/contact-us', contactRoute);

// importing authentication route
import authRoute from './routes/auth/auth.js';
app.use('/api/luckybuystore/auth/', authRoute);

// importing category route
import categoryRoute from './routes/category/category.js';
app.use('/api/luckybuystore/category/', categoryRoute);

// importing product route
import productRoute from './routes/product/product.js';
app.use('/api/luckybuystore/product/', productRoute);

app.get('/', async (req, res, next) => {
  try {
    return res.redirect('/api/luckybuystore/index');
    res.status(200);
  } catch (err) {
    next(err);
  }
});

app.all('*', async (req, res, next) => {
  try {
    res.status(404).send('<h4> Page Not Found </h4>');
    //    return next(customError(404, "<h4> Page Not Found </h4>"))
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {
  console.log(
    `${process.env.site_name} server started successfully on ${port}`,
  );
});

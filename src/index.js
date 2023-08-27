const express = require('express');
const { PORT } = require('./config');
const { databaseConnection } = require('./database');
const expressApp = require('./express-app');
const errorHandler = require('./utils/errors');

const StartServer = async () => {
  const app = express();
  const cors = require('cors');
  app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*'
  }));
  
  await databaseConnection();

  app.get('/', (req, res) => res.send('Welcome To Sarvu Sahitya'));

  await expressApp(app);
  errorHandler(app);
  app
    .listen(PORT, () => {
      console.log(`listening to port ${PORT}`);
    })
    .on('error', (err) => {
      console.log(err);
      process.exit();
    })
    .on('close', () => {
      channel.close();
    });
};

StartServer();

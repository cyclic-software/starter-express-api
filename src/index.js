const express = require('express');
const { PORT } = require('./config');
const { databaseConnection } = require('./database');
const expressApp = require('./express-app');
const { CreateChannel } = require('./utils');
const errorHandler = require('./utils/errors');

const StartServer = async () => {
  const app = express();

  await databaseConnection();

  // const channel = await CreateChannel();
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

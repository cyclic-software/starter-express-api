const express = require('express');
const cors = require('cors');
const path = require('path');

const {
  slider,
  cagtegory,
  tag,
  media,
  user
} = require('./api');
const { SubscribeMessage } = require('./utils');

module.exports = async (app) => {
  try {
    app.use(express.json());
    app.use(cors());
    app.use("/public", express.static(path.join(__dirname, 'public')));
    app.use('/uploads', express.static('uploads'));
    app.use(express.static('public'));
    app.use('/images', express.static('images'));

    // app.use(express.static(__dirname + '/public'));
    // const channel = await CreateChannel();
    slider(app);
    cagtegory(app);
    tag(app);
    media(app);
    user(app);
  } catch (error) {
    console.log(error);
  }

  // error handling
};

const express = require('express');
const cors = require('cors');
const path = require('path');

const {
  slider,
  cagtegory,
  tag,
  media,
  user,
  post,
  poet,
  feedback,
  contactus,
  adminregistry,
  notification,
  analytics
} = require('./api');
const { SubscribeMessage } = require('./utils');

module.exports = async (app) => {
  try {
    
    app.use(express.json());
    app.use("/public", express.static(path.join(__dirname, 'public')));
    app.use('/uploads', express.static('uploads'));
    app.use(express.static('public'));
    app.use('/images', express.static('images'));

    // app.use(express.static(__dirname + '/public'));
    app.get("/",  async (req, res, next) => {
      return res.json({data:"running"});

    });
    slider(app);
    poet(app);
    cagtegory(app);
    tag(app);
    feedback(app);
    contactus(app);
    media(app);
    user(app);
    post(app);
    adminregistry(app);
    notification(app);
    analytics(app);
  } catch (error) {
    console.log(error);
  }

  // error handling
};

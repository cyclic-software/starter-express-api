const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserController = require('../controllers/userController');


router.route('/register')
    .get(UserController.renderRegister)
    .post(UserController.register);

router.route('/login')
    .get(UserController.renderLogin)
    .post(passport.authenticate('local', { failureFlash: 'Passwordmu salah bro', failureRedirect: '/login' }), UserController.login);

router.route('/logout')
    .get(UserController.logout);

module.exports = router;
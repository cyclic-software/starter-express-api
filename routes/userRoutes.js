const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserController = require('../controllers/userController');
const { isLoggedIn, isAdmin } = require('../middleware');

router.route('/')
    .get(UserController.renderHome);

router.route('/register')
    .get(UserController.renderRegister)
    .post(UserController.register);

router.route('/login')
    .get(UserController.renderLogin)
    .post(passport.authenticate('local', { failureFlash: 'Passwordmu salah bro', failureRedirect: '/login' }), UserController.login);

router.route('/logout')
    .get(UserController.logout);

router.route('/admin/kasir')
    .get(isLoggedIn, isAdmin,UserController.getAddKasir)
    .post(isLoggedIn, isAdmin,UserController.register);

router.route('/kasir/:id')
    .delete(isLoggedIn, isAdmin,UserController.deleteKasir);

module.exports = router;

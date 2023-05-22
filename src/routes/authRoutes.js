const { Router } = require('express')

const authController = require('../controllers/authController')

const router = new Router()

router.get('', (req, res) => res.send('Welcome'))
router.get('/ping', authController.ping)
router.get('/users', authController.getAllUsers)
router.get('/user/:id', authController.getUserById)
router.get('/username/:name/:password', authController.login_get)

router.post('/signup', authController.signup_post)

module.exports = router
const express = require('express')
const { failureResponse, succesfullResponse } = require('../constant/message')
const userModel = require('../models/userModel')
const bcryptjs = require('bcryptjs')
const { JWT_SECRET, ROLES } = require('../constant/constant')
const jwt = require('jsonwebtoken')
const router = express.Router()
const { validationResult, } = require('express-validator')
const { registerValidator, loginValidator } = require('../validators/user')
const auth = require('../middleware/auth')

const mailgun = require('../services/mailgun')

router.get('/test',async(req,res)=>{
    return res.status(200).json('success')
})

router.post('/register', registerValidator, async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { userName, fullName, email, password, phoneNumber } = req.body
        const existuser = await userModel.findOne({ '$or': [{ email: email }, { userName: userName }] })
        if (existuser)
            return res.status(400).json({ error: 'User already exist' })

        const newUser = new userModel({
            userName: userName, email, fullName: fullName, password, phoneNumber
        })

        console.log('pass')

        const salt = await bcryptjs.genSalt(10)
        const hash = await bcryptjs.hash(newUser.password, salt)
        newUser.password = hash

        const registerUser = await newUser.save()


        const payload = {
            user: {
                id: newUser.id,
                email: newUser.email,
                userName: newUser.email,
                role: newUser.role
            }
        }

        const jwtData = jwt.sign(payload, JWT_SECRET)

        return res.status(200).json({
            success: true,
            msg: "registration succesfully",
            user: registerUser,
            token: `${jwtData}`
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'server error' })
    }
})



router.post('/login', loginValidator, async (req, res) => {
    console.log('userIn');
    try {
        if (!validationResult(req).isEmpty()) {
            return res.status(400).json({ error: "something wrong with validation" });
        }
        const { userName, password } = req.body
        const existUser = await userModel.findOne({ userName })
        if (!existUser) {
            return res.status(400).json({ error: 'No such user exsit' })
        }
        const isMatch = await bcryptjs.compare(password, existUser.password)
        if (!isMatch) {
            return res.status(400).json({ error: 'Password does not match' })
        }
        const payload = {
            user: {
                id: existUser.id,
                email: existUser.email,
                userName: existUser.email,
                role: existUser.role
            }
        }
        const jwtData = jwt.sign(payload, JWT_SECRET)
        return res.status(200).json({
            success: true,
            user: existUser,
            token: `${jwtData}`
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'server error' })
    }
})

router.post('/forgotPassword', async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        if (!email) {
            return res.status(400).json({ error: 'You must enter email' })
        }

        const existUser = await userModel.findOne({ email: email })
        if (!existUser) {
            return res.status(400).json({ error: 'No such user exsist' })
        }

        const token = Math.floor(1000 + Math.random() * 9000).toString();
        existUser.resetPasswordToken = token
        existUser.resetPasswordExpires = Date.now() + 300000

        existUser.save();

       await mailgun.sendEmail(
            existUser.email,
            'forgotPassword',
            req.headers.host,
            token
        )

        console.log("mail send");

        res.status(200).send({
            success: true,
            message: 'please check your email for the verification token'
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'server error' })
    }
})

router.post('/verify', async (req, res) => {
    try {
        const { email, userToken } = req.body
        if (!email && !userToken) {
            return res.status(400).json({ error: 'emaill or userToken is miissing' })
        }
        const existUser = await userModel.findOne({ email: email })
        if (!existUser) {
            return res.status(400).json({ error: 'No such user exsist' })
        }
        if (!(existUser.resetPasswordExpires > Date.now())) {
            return res.status(400).json({ error: 'Token is expired' })
        }
        if (!(existUser.resetPasswordToken === userToken)) {
            return res.status(400).json({ error: 'Token does not match' })
        }
        const payload = {
            user: {
                id: existUser.id,
                email: existUser.email,
                userName: existUser.email,
                role: existUser.role
            }
        }
        const jwtData = jwt.sign(payload, JWT_SECRET)
        return res.status(200).json({
            success: true,
            user: existUser,
            token: `${jwtData}`
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: 'server error' })
    }
})

router.get('/check', auth, async (req, res) => {
    console.log('checkibg', req.user.role);
})

module.exports = router
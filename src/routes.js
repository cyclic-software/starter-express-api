const express = require('express')

const phoneNumberToOtp = {};

const defaultRoutes = () => {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.send('Hello World!')
    });

    router.post('/generateOtp', (req, res) => {
        const { phoneNumber } = req.body;

        // Generate a 6-digit random number
        const otp = Math.floor(100000 + Math.random() * 900000);

        phoneNumberToOtp[phoneNumber] = otp;

        return res.status(200).json({ status: true, otp });
    });

    router.post('/verifyOtp', (req, res) => {
        const { phoneNumber, otp } = req.body;

        if (phoneNumberToOtp[phoneNumber] === otp) {
            delete phoneNumberToOtp[phoneNumber];
            return res.status(200).json({ status: true, message: 'OTP is valid' });
        }

        return res.status(200).json({ status: false, message: 'OTP is invalid' });
    });

    return router
}

module.exports = defaultRoutes
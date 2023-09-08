const express = require('express')

const phoneNumberToOtp = {};

const defaultRoutes = () => {
    const router = express.Router();

    router.get('/', (req, res) => {
        res.send('Welcome the Server! and its Runnning on Port 3000');
    });

    router.post('/generateOtp', (req, res) => {
        const { phoneNumber } = req.body;

        // Generate a 6-digit random number
        const otp = Math.floor(100000 + Math.random() * 900000);

        phoneNumberToOtp[phoneNumber] = otp;

        console.log(`OTP for ${phoneNumber} is ${otp}`);

        return res.status(200).json({ status: true, otp });
    });

    router.post('/verifyOtp', (req, res) => {
        const { phoneNumber, otp } = req.body;

        if (phoneNumberToOtp[phoneNumber] === otp) {
            delete phoneNumberToOtp[phoneNumber];
            console.log(`Successfully verified OTP for ${phoneNumber} and deleted from memory`)
            return res.status(200).json({ status: true, message: 'OTP is valid' });
        }

        console.log(`Failed to verify OTP for ${phoneNumber}`)

        return res.status(200).json({ status: false, message: 'OTP is invalid' });
    });

    return router
}

module.exports = defaultRoutes
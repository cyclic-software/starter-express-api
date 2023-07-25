// PANGGIL MODULE CRYPTO JS
const CryptoJs = require('crypto-js')
// PANGGIL USER MODEL NYA
const { userModel } = require('../models/UserModel')

class PassportMainController {
    static async getRegisterPage(req, res) {
        try {
            // KALAU BISA KE AUTH --> login
            if (req.user()) {
                return res.json({ 
                    status: 'success', 
                    isLoggedIn: true,
                    data: {
                        id: req.user.id,
                        username: req.user.username
                    } 
                });
            } else {
                //KALAU NGGA MSH REGI
                return res.json({ 
                    status: 'success', 
                    isLoggedIn: false                       
                });
            }
        } catch (error) {
                console.log(error);
                res.status(500).send(' INTERNAL SERVER ERROR !')
        }
    }

    static async getLoginPage(req, res){
        try {
            //KALAU BISA KE HALAMAN LAIN
            if (req.isAuthenticated()) {
                return res.json({ 
                    status: 'success', 
                    isLoggedIn: true,
                    data: {
                        id: req.user.id,
                        username: req.user.username
                    } 
                });
            } else {
                //KALAU NGGA TETAP HAL LOG
                return res.json({ 
                    status: 'success', 
                    isLoggedIn: false                       
                });
            }
        } catch (error) {
                console.log(error);
                res.status(500).send(' INTERNAL SERVER ERROR !')
        }
    }

    static async postRegisterPage(req, res){
        try {
            // AMBIL DATA YANG DIKASIH OLEH USER
            const data = req.body
            const email = data.email
            const username = data.username
            const password = data.password
            const confirm_password = data.confirm_password
            // VALIDASI INPUT USER
            if (password !== confirm_password) {
                return res.status(200).json({ status: "failed", message: "PASSWORD AND CONFIRMATION PASSWORD DO NOT MATCH" });
            }
            if (!validatePassword(password)) {
                return res.status(200).json({ status: "failed", message: "WRONG PASSWORD. MINIMUM PASSWORD MUST CONTAIN 2 UPPERCASE LETTERS, 2 SMALL LETTERS, 2 NUMBERS, AND 2 SYMBOLS" });
            }
            // CEK APAKAH ADA DUPLIKASI EMAIL DI DB
            const userDataByEmail = await userModel.getDataByEmail(email);
                if (userDataByEmail !== null) {
                return res.status(200).json({ status: "failed", message: "EMAIL ALREADY REGISTERED" });
            }
            // CEK APAKAH ADA DUPLIKASI USERNAME DI DB
            const userDataByUsername = await userModel.getData(username);
                if (userDataByUsername !== null) {
                return res.status(200).json({ status: "failed", message: "USERNAME ALREADY REGISTERED" });
            }
            // HASH PASSWORD
            const hashedPassword = CryptoJs.HmacSHA256(password, process.env.SECRET_LOGIN).toString()
            // INSERT EMAIL, USERNAME & PASSWORD KE DATABASE
            await userModel.insertData(email, username, hashedPassword)
            res.status(200).json({ status: 'success', message: 'DATA IS SUCCESSFULLY REGISTERED' });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'INTERNAL SERVER EROR' })
        }
    }
}
        // FUNCTION VALIDATE PASSWORD
        function validatePassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }

module.exports = { PassportMainController }
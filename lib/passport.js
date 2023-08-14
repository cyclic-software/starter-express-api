const passport = require('passport')
const CryptoJs = require('crypto-js')
const LocalStrategy = require('passport-local').Strategy
const { userModel } = require('../models/UserModel')

async function authenticate(username, password, done) {
    try {
        // AMBIL DATA USERNYA
        let userData = await userModel.getData(username)
        // HANDLE DATA USER YANG TIDAK ADA
        if(userData === null) {
            return done(null, false, { message: 'NO USER DATA !' })
        }
        // BANDINGKAN PASSWORDNYA
        const hashedPassword = CryptoJs.HmacSHA256(password, process.env.SECRET_LOGIN).toString()
        if(hashedPassword !== userData.password) {
            return done(null, false, { message: 'INVALID PASSWORD' })
        }
        // MASUKKAN DATA USER KE PASSPORT
        delete userData.password
        return done(null, userData)
    }   catch (error) {
        console.log(error)
        return done(error, false, { message: err.message })
    }
}

passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, authenticate))

passport.serializeUser(
    (user, done) => done(null, user.id)
)
passport.deserializeUser(
    async function(id, done){
        return done (null, await userModel.getDataByPk(id))
    }
)

module.exports = passport
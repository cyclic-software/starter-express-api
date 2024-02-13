const jwt = require('jsonwebtoken')
const { failureResponse } = require('../constant/message')
const { JWT_SECRET } = require('../constant/constant')

const auth = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) {
        res.status(400).json({ error: 'please provide token' })
    }
    try {
        const verify = jwt.verify(token, JWT_SECRET)
        req.user = verify.user
    } catch (error) {
        res.status(400).json({ error: "please authenticate using valid token" })
    }
    next()
}

module.exports=auth
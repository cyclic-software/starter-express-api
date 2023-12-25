const jwt = require("jsonwebtoken")
const createJWT = (user) => {
    try {
        let token = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: '30d',
        })
        return token
    } catch (error) {
        console.log('error', error)
    }
}
const verifyAuth = (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (authorization) {
            const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
            jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
                if (err) {
                    res.status(401).send({ message: 'Invalid Token' });
                } else {
                    req.user = decode;
                    next();
                }
            });
        } else {
            res.status(401).send({ message: 'No Token' });
        }
    } catch (error) {
        console.log('error', error)
    }
}
const isAdmin = (req, res, next) => {
    try {
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            res.status(401).send({ message: 'Invalid Admin Token' });
        }
    } catch (error) {
        console.log('error', error)
    }
};
module.exports = {
    createJWT, verifyAuth, isAdmin
}
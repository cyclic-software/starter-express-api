function PassportAuthorizationCheck(req, res, next) {
    if(req.isAuthenticated()) next()
    else res.status(401).send('NOT AUTHORIZED')
    }

module.exports = { PassportAuthorizationCheck }
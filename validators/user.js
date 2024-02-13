const { body } = require("express-validator")


const registerValidator = [
    body('email',"provide proper email").isEmail(),
    body('password','password is too short').isLength({min:5}),
    body('userName','Username must be alphanumeric').isLength({min:5}),
    body('fullName',"fullname must not be empty").isString()
]

const loginValidator = [
    body('password','password is too short').isLength({min:5}),
    body('userName','Username must be alphanumeric').isAlphanumeric(),
]

module.exports = { registerValidator,loginValidator }
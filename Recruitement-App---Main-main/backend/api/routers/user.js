const User = require("../controllers/user")
const router = require("express").Router()

router.post("/signup",User.signup)


router.post("/login",User.login)


router.get("/login", User.getuser)
module.exports = router
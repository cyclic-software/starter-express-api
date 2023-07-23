const router = require("express").Router();

const{speechFunction}= require('../../controllers/externalapis')
router.post('/speech',speechFunction)

module.exports = router;
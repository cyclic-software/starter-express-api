const express = require("express");
const { predictFor30DaysNext } = require("../controllers/predictController")
const { verifyAuth } = require("../middlewares/authAction");


let predictRouter = express.Router();

predictRouter.get(
    "/",
    verifyAuth,
    predictFor30DaysNext
);


module.exports = predictRouter;
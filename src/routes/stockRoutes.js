const express = require("express");
const { getStocks, getInfoBank } = require("../controllers/stockController")


let stockRouter = express.Router();

stockRouter.get(
    "/",
    getStocks
);
stockRouter.get("/info/:bank_code", getInfoBank)


module.exports = stockRouter;
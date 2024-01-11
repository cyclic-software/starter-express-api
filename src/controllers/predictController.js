const expressAsyncHandler = require("express-async-handler");
const { getDB } = require("../dbs/init.mongodb")
const axios = require("axios");
const path = require('path');
const convertUrl = require("../utils/formatUrl");

const predictFor30DaysNext = expressAsyncHandler(async (req, res) => {
    const { bank_code } = req.query
    const response = await axios.get(`${process.env.SERVER_FLASK_URL}/predict/${bank_code}`)
    const response1 = await axios.get(`${process.env.SERVER_FLASK_URL}/info/${bank_code}`)
    console.log('response1', response1)
    res.send({
        chart_url: process.env.SERVER_FLASK_URL + "/" + response.data,
        pe: response1?.data?.trailingPE,
        roa: response1?.data?.returnOnAssets,
        roe: response1?.data?.returnOnEquity,
        ocf: response1?.data?.operatingCashflow,
        totalDebt: response1?.data?.totalDebt,
    });
})

module.exports = {
    predictFor30DaysNext
}
const expressAsyncHandler = require("express-async-handler");
const axios = require("axios");
const { getYesterdaysDate, codeStocks } = require("../utils/");

const getStocks = expressAsyncHandler(async (req, res) => {
    console.log("da vao day")
    let selectedDate = req.query.selectedDate
    if (!selectedDate) {
        selectedDate = getYesterdaysDate()
    }
    let result = []
    const response = await axios.get(`http://api.marketstack.com/v1/eod?access_key=${process.env.MARKETSTACK_API_KEY}&symbols=${Object.values(codeStocks).join(",")}&date_from=${selectedDate}&date_to=${selectedDate}`)
    for (let i = 0; i < response.data.pagination.total; i++) {
        result = [...result, { id: i + 1, "open": response.data.data[i].open, "high": response.data.data[i].high, "low": response.data.data[i].low, "close": response.data.data[i].close, "volume": response.data.data[i].volume, "symbol": response.data.data[i].symbol.split('.')[0] }]
    }
    res.send(
        result
    );
})

const getInfoBank = expressAsyncHandler(async (req, res) => {
    const { bank_code } = req.params
    const response = await axios.get(`${process.env.SERVER_FLASK_URL}/info/${bank_code}`)
    console.log('response', response)
    res.send(
        response.data
    );
})

module.exports = {
    getStocks, getInfoBank
}
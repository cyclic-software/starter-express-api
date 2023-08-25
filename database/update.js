const config = require("./config");
const getExchangeRates = require('../API-helpers/getExchangeRates')

var currencies = ["USD", "INR", "EUR", "GBP", "JPY"];

function insertCurrencyData(currencies) {
    getExchangeRates(currencies).then((currencyData) => {
        const timeseries = new Date();
        currencyData.rates["timeseries"] = timeseries;
        config.insertData(currencyData.rates);
    });
}

config.connect().then(() => {
    insertCurrencyData(currencies);
    setInterval(() => {
        insertCurrencyData(currencies);
    }, 12 * 60 * 60 * 1000); // 12 hours
});

process.on("SIGINT", async () => {
    await config.closeConnection();
    process.exit(0);
});
require('dotenv').config();

const ExchangeApi = process.env.EXCHANGE_API;

async function getExchangeRates(currencies) {
    var url = "http://api.exchangeratesapi.io/v1/latest?access_key=" + ExchangeApi + "&symbols=" + currencies.join(",");
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}
module.exports = getExchangeRates;

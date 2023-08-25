const express = require('express');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

// const getExchangeRates = require('./API-helpers/getExchangeRates');
// const convert = require('./API-helpers/currencyConversion');
// 
// require('./database/update');
// const getHistoricalData = require('./database/config').getData;
// 
// const insertUser = require('./database/config').insertUser;
// const login = require('./database/config').login;
// 
const app = express();
const port = process.env.PORT || 3000;
// 
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
    max: 100, // maximum number of requests
    keyGenerator: function (req) {
        return req.ip; // use the IP address as the key
    }
});
app.use(limiter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});
// 
// var currencies = ["USD", "INR", "EUR", "GBP", "JPY"];
// 
// app.get('/exchange-rates', async (req, res) => {
    // try {
        // const token = req.headers.authorization;
        // if (token == undefined) {
            // res.status(401).json({ error: 'Unauthorized' });
            // return;
        // }
        // jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        // if (err) {
            // return res.status(401).json({ message: 'Unauthorized' });
        // } else {;
            // getExchangeRates(currencies).then((currencyData) => {
                // res.json(currencyData.rates);
            // });
        // }
    // });
    // } catch (error) {
        // res.status(500).json({ error: 'An error occurred' });
    // }
// });
// 
// app.post('/convert', async (req, res) => {
    // try {
        // const token = req.headers.authorization;
        // if (token == undefined) {
            // res.status(401).json({ error: 'Unauthorized' });
            // return;
        // }
        // jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        // if (err) {
            // return res.status(401).json({ message: 'Unauthorized' });
        // } else {;
            // getExchangeRates(currencies).then((exchangeRates) => {
                // const amount = req.query.amount;
                // const currency1 = req.query.currency1;
                // const currency2 = req.query.currency2;
                // const result = convert(currency1, currency2, exchangeRates.rates, amount);
                // res.json({ result: result });
            // });
        // }
    // });
    // } catch (error) {
        // res.status(500).json({ error: 'An error occurred' });
    // }
// });
// 
// app.post('/historical-conversion', async (req, res) => {
    // try {
        // const token = req.headers.authorization;
        // if (token == undefined) {
            // res.status(401).json({ error: 'Unauthorized' });
            // return;
        // }
        // jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        // if (err) {
            // return res.status(401).json({ message: 'Unauthorized' });
        // } else {
            // const curr1 = req.query.currency1;
            // const curr2 = req.query.currency2;
            // getHistoricalData(curr1, curr2).then((data) => {
                // res.json(data);
            // });
        // }
    // });
    // } catch (error) {
        // res.status(500).json({ error: 'An error occurred' });
    // }
// });
// 
// app.post('/sign-up', async (req, res) => {
    // try {
        // const username = req.query.username;
        // const password = req.query.password;
        // const result = await insertUser(username, password);
        // res.json({ result: result });
    // } catch (error) {
        // res.status(500).json({ error: 'An error occurred' });
    // }
// });
// 
// app.post('/login', async (req, res) => {
    // try {
        // const username = req.query.username;
        // const password = req.query.password;
        // const result = await login(username, password);
        // res.json({ result: result });
    // } catch (error) {
        // res.status(500).json({ error: 'An error occurred' });
    // }
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
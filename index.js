const express = require('express')
const app = express()
const standingsJson = require('./standings.json')
var cors = require('cors');
const cron = require('node-cron')
const request = require('request');
const fs = require('fs');
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

var allowedOrigins = ['http://localhost:3000',
    'https://draft-bola-ao-ar.onrender.com'];

cron.schedule("0 18,20,22,0,1,2,3,4,5,6,7 * * *", function () {
    console.log("Updating Standings...");
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
            'x-rapidapi-key': process.env.API_KEY
        }
    };

    request('http://data.nba.net/prod/v1/current/standings_all.json', options, function (error, response, body) {
        console.log('Received response from API.');
        if (!error && response.statusCode == 200) {
            json = JSON.parse(response.body)
            json.lastUpdate = new Date().toLocaleString("pt-PT")
            fs.writeFile('./standings.json', JSON.stringify(json), function (err) {
                if (err) {
                    console.log(err);
                    throw err
                };
                console.log('Standings file was updated!');
            }
            );
        }
    })
})


app.get('/standings', (req, res) => {
    console.log('Requesting standings...')
    res.send(standingsJson)
})

app.listen(process.env.PORT || 3001)
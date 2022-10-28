const express = require('express')
const app = express()
var cors = require('cors');
const cron = require('node-cron')
const request = require('request');
const moment = require('moment')
const fs = require('fs');
path = require('path'),
    filePath = path.join(__dirname, 'standings.json');

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

app.get('/standings', async (req, res) => {
    console.log('GET - Requesting standings...')
    fs.readFile(filePath, function (err, data) {
        if (!err) {
            const jsonFile = JSON.parse(data);
            const fileDate = moment(jsonFile.lastUpdate, 'DD-MM-YYYY HH:mm:ss')
            if (fileDate.add(2, 'hour').isBefore(moment())) {

                console.log("Updating Standings...");
                const options = {
                    method: 'GET',
                    headers: {
                        'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com',
                        'x-rapidapi-key': process.env.API_KEY
                    }
                };
                request('https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2022', options, function (error, response, body) {
                    console.log('Received response from API.');
                    if (!error && response.statusCode == 200) {
                        json = JSON.parse(response.body)
                        json.lastUpdate = moment().format('DD-MM-YYYY HH:mm:ss')
                        fs.unlinkSync(filePath);
                        console.log('File was deleted.');
                        fs.writeFile(filePath, JSON.stringify(json), function (err) {
                            if (err) {
                                console.log(err);
                                throw err
                            };
                            console.log('Standings file was updated!');
                        }

                        );
                        res.send(JSON.stringify(json))
                    } else {
                        console.log(response.body);
                    }
                })
            } else {
                res.send(jsonFile)
            }
        } else {
            console.log(err);
        }
    });
})
app.listen(process.env.PORT || 3001)
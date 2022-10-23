const express = require('express')
const app = express()
const standingsJson = require('./standings.json')
var cors = require('cors');
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

app.get('/stats', async (req, res) => {
    console.log('Requesting stats...')
    NBA.stats.teamStats({ Season: '2022-23' }).then(x => {
        console.log("Sending stats...")
        res.send(x)
    });
})

app.get('/standings', (req, res) => {
    console.log('Requesting standings...')
    res.send(standingsJson)
})
app.listen(process.env.PORT || 3001)
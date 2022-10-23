const express = require('express')
const app = express()
const standingsJson = require('./standings.json')
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
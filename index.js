const express = require('express')
const path = require('path');
const app = express()
const main = express()

app.get('/', (req, res) => {
    console.log("Just got a request!")
    res.sendFile(path.join(__dirname, '/main/index.html'));
})

app.get('/status', (req, res) => {
    console.log("Just got a request!")
    res.json({"status": "main"})
})

app.listen(process.env.PORT || 3000)

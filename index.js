const express = require('express')
const path = require('path');
const app = express()
app.get('/', (req, res) => {
    console.log("Just got a request!")
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.get('/status', (req, res) => {
    console.log("Just got a request!")
    res.json({"status": "main"})
})
app.listen(process.env.PORT || 3000)

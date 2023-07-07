const express = require('express')
const app = express()
app.get('/', (req, res) => {
    console.log("Just got a request!")
    res.render("./index.html")
})

app.get('/status', (req, res) => {
    console.log("Just got a request!")
    res.json({"status": "main"})
})
app.listen(process.env.PORT || 3000)

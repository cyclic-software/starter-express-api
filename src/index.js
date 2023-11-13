const express = require('express')
const app = express()
app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo! Zaunitas, bem-vindos ao laboratório de zaun')
})
app.listen(process.env.PORT || 3000)
const express = require('express')
const app = express()

app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo! version 2')
})
app.listen(process.env.PORT || 3000, () => {
    console.log(`listening...`)
})
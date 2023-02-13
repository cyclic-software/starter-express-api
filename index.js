const express = require('express')
const app = express()

var text2png = require('text2png');

app.all('/', (req, res) => {
    console.log("Just got a request!")
    var text = req.query.text
    res.statusCode = 200
    res.setHeader('Content-Type', 'image/png')
    res.write(text2png(text, {output: 'buffer'}))
    res.end()
})
app.listen(process.env.PORT || 3000)

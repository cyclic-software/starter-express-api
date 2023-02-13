const express = require('express')
const path = require('path')
const app = express()

var text2png = require('text2png');

app.set("views", path.join(__dirname))
app.set("view engine", "ejs")

app.get('/', function (req, res) {
    var text = req.query.text
    res.statusCode = 200
    res.setHeader('Content-Type', 'image/png')
    res.write(text2png(text, {output: 'buffer'}))
    res.end()
})
app.listen(process.env.PORT || 3000, function(error) {
    if(error) throw error
    console.log("server started")
})

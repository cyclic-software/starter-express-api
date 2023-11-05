const express = require('express')
const app = express()
app.get('/test', (req, res) => {
    console.log("Just got a request!")
    res.send('Hello User!')
})
app.listen(process.env.PORT || 3000)

const express = require('express')
const app = express()

app.post("/",(rq,rs)=>rs.send(req.body));

app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.listen(process.env.PORT || 3000)
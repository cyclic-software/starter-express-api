const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors());

app.get('/test', (req, res) => {
    console.log("Just got a request!")
    let object = {
        name: "Petya",
        age: 15
    };

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.send(object);
})
app.listen(process.env.PORT || 3000)

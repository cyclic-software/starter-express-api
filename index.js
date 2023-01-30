const express = require('express');
const app = express();

const PORT = 3000;

app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Hello world✋✋')
})

app.listen(PORT, (
    console.log(`Server is now Running on https://localhost:${PORT}`)
))

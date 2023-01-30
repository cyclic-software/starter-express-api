const express = require('express')
const app = express()
app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Hello world✋✋')
})

app.listen(PORT, (
//     creating a server
    console.log(`Server is now Running on https://localhost:${PORT}`)
))

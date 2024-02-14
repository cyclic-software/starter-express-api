const express = require('express')
const app = express()
app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yoooo!')
})
app.get('/test',(req,res)=>{
    res.status(200).send('hello')
})
app.listen(process.env.PORT || 3000)

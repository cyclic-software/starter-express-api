const express = require('express')
const app = express()
app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.get('/test',(res,req)=>{
    return res.status(200).json({check:'hiii'})
})
app.listen(process.env.PORT || 3000)
const express = require('express')
const app = express()
app.all('/', (req, res) => {
    
    res.send('............................Server is Started........................... ')
})
app.listen(process.env.PORT || 3000)

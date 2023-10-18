const express = require('express')
const app = express()
app.all('/', (req, res) => {
    
    res.send('Hello World!')
})

app.post('/api/scholarship/login', (req, res) => {
    
    res.send({result : {accessToken: 'Login success'} })
})
app.listen(process.env.PORT || 3000)
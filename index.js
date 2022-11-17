const express = require('express')
const axios = require('axios')
const app = express()
const port = process.env.PORT || 3000;

app.get('/api/users', function(req, res){
    const user_id = req.query.id;
    const token = req.query.token;
    const geo = req.query.geo;

    res.send({
        'user_id': user_id,
        'token': token,
        'geo': geo,
    });
});

app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})

app.listen(port);
console.log('Server started at http://localhost:' + port)
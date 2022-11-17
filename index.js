const express = require('express')
const axios = require('axios')
const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// get data from query ?&&
app.get('/api/users', function (req, res) {
    const user_id = req.query.id;
    const token = req.query.token;
    const geo = req.query.geo;

    res.send({
        'user_id': user_id,
        'token': token,
        'geo': geo,
    });
});

app.get('/api/data', function(req, res){
    let config = {
        method: 'get',
        url: 'https://api.quotable.io/random',
    };

    console.log('start');
    axios(config)
        .then(function(response){
            // console.log(response.data)
            res.send(response.data)
        })
        .catch(function(error){
            console.log(error)
        })
})

app.get('/api/data', function(req, res){
    let config = {
        method: 'get',
        url: 'https://api.quotable.io/random',
    };

    console.log('start');
    axios(config)
        .then(function(response){
            // console.log(response.data)
            res.send(response.data)
        })
        .catch(function(error){
            console.log(error)
        })
})


// modif parameter
app.param('name', function (req, res, next, name) {
    const modified = name.toUpperCase();

    req.name = modified;
    next();
})
app.get('/api/users/:name', function (req, res) {
    res.send('Hello ' + req.name + '!!!');
})


// post data from body from-urlencoded
app.post('/api/users', function (req, res) {
    const user_id = req.body.id;
    const token = req.body.token;
    const geo = req.body.geo;

    res.send({
        'user_id': user_id,
        'token': token,
        'geo': geo
    });
});

app.get('/api/:version', function (req, res) {
    res.send(req.params.version);
});

app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})

app.listen(port);
console.log('Server started at http://localhost:' + port)
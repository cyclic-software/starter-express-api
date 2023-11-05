const express = require('express')
const app = express()
app.get('/test', (req, res) => {
    console.log("Just got a request!")
    let object = {
    	name : "Petya",
      	age : 15
    };
    
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Origin', 'https://smartquiz.pages.dev/');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.send(object)
})
app.listen(process.env.PORT || 3000)

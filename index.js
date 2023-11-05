const express = require('express')
const app = express()
app.get('/test', (req, res) => {
    console.log("Just got a request!")
    let object = {
    	name : "Petya",
      	age : 15
    };
    
    res.header("Access-Control-Allow-Origin", "*");
    res.send(object)
})
app.listen(process.env.PORT || 3000)

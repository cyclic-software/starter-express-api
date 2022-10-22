const express = require('express');

const app = express();
const port = process.env.PORT;

app.listen(port, () => {
    console.log('Server started!');
  });

  app.route('/api/authorize').options((req,res,next)=>{
    
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
  });
  
  app.route('/api/authorize').get((req, res) => {

    var request = require('request'); // "Request" library
    var client_id = process.env.client_id; // Your client id
    var client_secret = process.env.client_secret; // Your secret

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
          grant_type: 'client_credentials'
        },
        json: true
    };

    var AuthReponse = request.post(authOptions, function(error, response, body) {
        if (!error) {
            console.log(response.body);
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
            
            res.send(
            response.body
            );
        } else {
            console.log(error);
            res.send(
                error
            );
        }
      });
  });

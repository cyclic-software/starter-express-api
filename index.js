const express = require('express');
const app = express();

const allowCrossOrigin = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', ['GET'].join(','));
  res.header('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
};

app.all('/', (req, res) => {
    console.log("Just got a request!");
    res.send('Yo!');
});

app.use(allowCrossOrigin);
app.listen(process.env.PORT || 3000);

const express = require('express')
const app = express()
// app.all('/', (req, res) => {
//     console.log("Just got a request!")
//     res.send('Yo!')
// })
app.listen(process.env.PORT || 3000)

app.get('/', function (req, res) {
  console.log('recive');
  res.json({
    status:"recive"
  });
})
app.get('/test', function (req, res) {
  console.log('recive');
  res.json({
    status:"recive"
  });
})
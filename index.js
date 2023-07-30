const express = require('express')
const app = express()
app.use(express.json());

app.listen(process.env.PORT || 3000)

app.get('/', async function (req, res) {
  process.env.red_led = "OFF";
  console.log('recive');
  res.json({
    status: "recive",
    data:process.env.red_led
  });
})
app.post('/led', async function (req, res) {
  var body = req.body;
  process.env.red_led = body.data.red_led; 
  body.data.red_led = process.env.red_led;
  res.json({
    status: true,
    data: body
  });
})

app.get('/led', async function (req, res) {
  try {
    var data = {
      data:{
        red_led : process.env.red_led
      }
    };
    res.json({
      status: true,
      data: data
    });
  } catch (error) {
    console.log('An error has occurred ', error);
    res.json({
      status: false
    });
  }

})
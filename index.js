const express = require('express')
const app = express()
const { writeFileSync, readFileSync } = require('fs');
app.use(express.json());
const path = './db.json';

app.listen(process.env.PORT || 3000)

app.get('/', async function (req, res) {

  console.log('recive');
  res.json({
    status: "recive"
  });
})
app.post('/led', async function (req, res) {
  var body = req.body; 

  await writeFileSync(path, JSON.stringify(body, null, 2), 'utf8');

  res.json({
    status: true,
    data: body
  });
})

app.get('/led', async function (req, res) {
  try {

    var data = await readFileSync('./db.json');
    data = JSON.parse(data);
    data.data.red_led = process.env.red_led;
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
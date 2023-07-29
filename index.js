const express = require('express')
const app = express()
const { writeFileSync, readFileSync } = require('fs');

const path = './db.json';

app.listen(process.env.PORT || 3000)

app.get('/', async function (req, res) {

  console.log('recive');
  res.json({
    status: "recive"
  });
})


app.get('/test', async function (req, res) {
  try {

    var data = await readFileSync('./db.json');
    data = JSON.parse(data);

    await writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');

    res.json({ 
      status: true,
      data : data
    });
  } catch (error) {
    console.log('An error has occurred ', error);
    res.json({
      status: false
    });
  }

})
const express = require('express')
const app = express()
const { writeFileSync, readFileSync } = require('fs');
app.use(express.json());
const path = './db.json';
const AWS = require("aws-sdk");
const s3 = new AWS.S3()

app.listen(process.env.PORT || 3000)

app.get('/', async function (req, res) {


  await s3.putObject({
    Body: JSON.stringify({ key: "value" }),
    Bucket: "cyclic-good-handbag-hare-eu-central-1",
    Key: "some_files/my_file.json",
  }).promise()

  // get it back
  let my_file = await s3.getObject({
    Bucket: "cyclic-good-handbag-hare-eu-central-1",
    Key: "some_files/my_file.json",
  }).promise()

  console.log(JSON.parse(my_file))

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
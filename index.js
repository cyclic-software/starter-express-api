const express = require('express')
const app = express()
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
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
app.get('/test', async function (req, res) {

  await s3.putObject({
    Body: JSON.stringify({key:"test"}),
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
    status:"recive"
  });
})
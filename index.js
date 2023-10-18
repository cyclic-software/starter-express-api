const express = require("express");
const app = express();
var cors = require("cors");
const cron = require("node-cron");
const request = require("request");
const moment = require("moment");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
(path = require("path")), (filePath = path.join("/", "standings.json"));

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

const allowedOrigins = [
  "http://localhost:3000",
  "https://draft-bola-ao-ar.onrender.com",
];

const requestOptions = {
  // uri: 'https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2022',
  uri: "https://random-data-api.com/api/v2/banks",
  method: "GET",
  headers: {
    "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
    "x-rapidapi-key": process.env.API_KEY,
  },
  json: true, // Automatically parses the JSON string in the response
};

app.get("/standings2", async (req, res) => {
  console.log("GET - Requesting standings...");
  try {
    await s3
      .getObject({
        Bucket: "cyclic-elated-tuxedo-mite-eu-central-1",
        Key: "standings2.json",
      })
      .promise()
      .then((data) => {
        const jsonFile = JSON.parse(data);
        const fileDate = moment(jsonFile.lastUpdate, "DD-MM-YYYY HH:mm:ss");
        if (fileDate.add(1, "hour").isBefore(moment())) {
          console.log("Updating Standings...");
          requestStandingsAndSave().then((result) => {
            res.send(result);
          });
        } else {
          res.send(jsonFile);
        }
      });
  } catch (err) {
    console.log("File does not exists. Creating a new one.");
    console.log(err);
    requestStandingsAndSave().then((result) => {
      res.send(result);
    });
  }
});

function requestStandingsAndSave() {
  return new Promise((resolve, reject) => {
    request(requestOptions, (error, response, json) => {
      if (!error && response.statusCode === 200) {
        console.log(json);
        json.lastUpdate = moment().format("DD-MM-YYYY HH:mm:ss");

        let fileInStringFormat = JSON.stringify(json);

        // For demonstration, write to a local file instead of S3
        s3.putObject({
          Body: fileInStringFormat,
          Bucket: "cyclic-elated-tuxedo-mite-eu-central-1",
          Key: "/standings2.json",
        }).promise();
        resolve(JSON.stringify(fileInStringFormat));
      } else {
        console.error(
          "Error:",
          error || response.statusCode,
          response && response.statusMessage
        );
        reject(error || response.statusCode);
      }
    });
  });
}

// app.get("/standings", async (req, res) => {
//   console.log("GET - Requesting standings...");
//   fs.readFile("standings.json", function (err, data) {
//     if (!err) {
//       const json = JSON.parse(data);
//       json.lastUpdate = moment().format("DD-MM-YYYY HH:mm:ss");
//       res.send(JSON.stringify(json));
//     }
//   });
// });
app.listen(process.env.PORT || 3001);

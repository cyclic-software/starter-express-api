const express = require("express");
const app = express();
var cors = require("cors");
const cron = require("node-cron");
const request = require("request");
const moment = require("moment-timezone");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
// const fs = require("fs");
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
  uri: "https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2024",
  method: "GET",
  headers: {
    "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
    "x-rapidapi-key": process.env.API_KEY,
  },
  json: true,
};

app.get("/standings", async (req, res) => {
  console.log("Requesting standings...");
  try {
    await s3
      .getObject({
        Bucket: "cyclic-elated-tuxedo-mite-eu-central-1",
        Key: "standings.json",
      })
      .promise()
      .then((data) => {
        const jsonFile = JSON.parse(data.Body);
        const fileDate = moment(jsonFile.lastUpdate, "DD-MM-YYYY HH:mm:ss");
        if (fileDate.add(1, "hour").isBefore(moment().tz("Europe/Lisbon"))) {
          console.log("Updating Standings...");
          requestStandings().then((result) => {
            res.send(result);
          });
        } else {
          res.send(jsonFile);
        }
      });
  } catch (err) {
    console.log("File doesn't exists. Creating a new one...");
    requestStandings().then((result) => {
      res.send(result);
    });
  }
});

function requestStandings() {
  return new Promise((resolve, reject) => {
    request(requestOptions, (error, response, json) => {
      if (!error && response.statusCode === 200) {
        json.lastUpdate = moment()
          .tz("Europe/Lisbon")
          .format("DD-MM-YYYY HH:mm:ss");
        s3.putObject({
          Body: JSON.stringify(json),
          Bucket: "cyclic-elated-tuxedo-mite-eu-central-1",
          Key: "standings.json",
        }).promise();
        resolve(json);
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
//       res.send(json);
//     }
//   });
// });
app.listen(process.env.PORT || 3001);

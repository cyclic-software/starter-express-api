const express = require("express");
const app = express();
var cors = require("cors");
const cron = require("node-cron");
const request = require("request");
const moment = require("moment");
// const AWS = require("aws-sdk");
// const s3 = new AWS.S3();
const fs = require("fs");
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

const options = {
  method: "GET",
  headers: {
    "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
    "x-rapidapi-key": process.env.API_KEY,
  },
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
          const result = requestStandingsAndSave();
          res.send(result);
        } else {
          res.send(jsonFile);
        }
      });
  } catch (err) {
    console.log("File does not exists. Creating a new one.");
    console.log(err);
    requestStandingsAndSave();
  }
});

function requestStandingsAndSave() {
  // "https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2022",
  return fetch("https://random-data-api.com/api/v2/banks", options)
    .then((response) => {
      console.log("Received response from API.");
      if (response.status === 200) {
        return response.json();
      } else {
        console.log("Error:", response.status, response.statusText);
        throw new Error("Failed to fetch data");
      }
    })
    .then((json) => {
      console.log(json);
      json.lastUpdate = moment().format("DD-MM-YYYY HH:mm:ss");

      let fileInStringFormat = JSON.stringify(json);

      return s3
        .putObject({
          Body: fileInStringFormat,
          Bucket: "cyclic-elated-tuxedo-mite-eu-central-1",
          Key: "/standings2.json",
        })
        .promise();
    })
    .catch((error) => {
      console.error("Error:", error.message);
      // Handle errors or return a default value if needed
      return null;
    });
}
app.get("/standings", async (req, res) => {
  console.log("GET - Requesting standings...");
  fs.readFile("standings.json", function (err, data) {
    if (!err) {
      const json = JSON.parse(data);
      json.lastUpdate = moment().format("DD-MM-YYYY HH:mm:ss");
      res.send(JSON.stringify(json));
    }
  });
});
app.listen(process.env.PORT || 3001);

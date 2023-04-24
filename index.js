const express = require("express");
const app = express();
var cors = require("cors");
const cron = require("node-cron");
const request = require("request");
const moment = require("moment");
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

app.get("/standings", async (req, res) => {
  console.log("GET - Requesting standings...");
  fs.readFile(filePath, function (err, data) {
    if (!err) {
      const json = JSON.parse(data);
      res.send(JSON.stringify(json));
    }
  });
});
app.listen(process.env.PORT || 3001);

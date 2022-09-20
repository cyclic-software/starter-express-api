const express = require("express");
require("express-async-errors");
const calendarRouter = require("./routes/calendar");
const { CLIENT, PORT }=require("./settings/config");

const app = express();

process.on("unhandledRejection", (error) => {
  console.error("Unhandled error", error);
});

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (Cross Origin Resource Sharing)
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", CLIENT);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/scrape", calendarRouter);

app.use("*", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo! hohoho");
});

app.listen(PORT || 3000);

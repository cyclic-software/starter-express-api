const express = require("express");
const mongoose = require("mongoose");

const app = express();

const url =
  "mongodb+srv://Password:Password@cluster0.m9g1x.mongodb.net/maps?retryWrites=true&w=majority";

mongoose.connect(url).then(() => {
  console.log("connected to database");
});

app.all("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo sam!");
});
app.listen(process.env.PORT || 3000, () => {
  console.log("Server is Running");
});

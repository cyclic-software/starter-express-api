const express = require("express");
const product = require("./product.model");

const app = express.Router();

app.get("/", (req, res) => product.find().then((r) => {
    res.send(r);
}));


module.exports = app;
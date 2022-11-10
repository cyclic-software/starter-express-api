const express = require("express");
const product = require("./product.model");

const app = express.Router();

let name = "cover"
product.find().then((r) => {
    console.log("boom")
    console.log(r);
}).catch((e)=>console.log(e)).finally(()=>console.log("hoola "));

app.get("/", async (req, res) => {
    let prd = await product.find();


})


module.exports = app;
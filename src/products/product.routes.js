const express = require("express");
const product = require("./product.model");

const app = express.Router();



app.get("/", async (req, res) => {
    let prd = await product.find();
    res.send(prd);
})


app.get("/search", async (req, res) => {
    let q = req.query.q;
    let results = [];
    let prd = await product.find();
    for (let i = 0; i < prd.length; i++) {
        if (prd[i].name && prd[i].name.toLocaleLowerCase().includes(q.toLocaleLowerCase()));
        results.push(prd[i]);
    }
    console.log(q)

    res.send(results);

})


module.exports = app;
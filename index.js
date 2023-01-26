const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
import ("node-fetch");


const app = express();
app.use(cors());
app.use(morgan("coins"));

//routes
app.get("/", (req, res) => {
    const url = "https://api.coinranking.com/v2/coins";
    (async() => {
        try {
            await fetch(`${url}`, {
                    headers: { "x-access-token": `${process.env.COIN_RANKING_API_KEY}` }
                }).then((response) => response.json())
                .then((json) => {
                    console.log(json);
                    res.json(json);
                })
        } catch (err) {
            console.log(err);
        }
    })()
})


const port = process.env.PORT || 3000;

app.listen(port, (err) => {
    if (err) console.log(err);
    else console.log("Server is running...");
})

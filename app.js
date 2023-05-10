const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { log } = require("console");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("/"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");

    console.log(__dirname);
})

app.post("/", function (req, res) {

    const fname = req.body.f;
    const lname = req.body.l;
    const mails = req.body.e;
    const data = {
        members: [
            {
                email_address: mails,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    }
    const url = "https://us11.api.mailchimp.com/3.0/lists/f1ba57a006";
    const jsonData = JSON.stringify(data);
    const options = {
        method: "POST",
        auth: "codu:1e473f143483e349d3db309b489a6193-us11"
    }
    const request = https.request(url, options, function (response) {
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
    app.post("/fa",function(req,res){
        res.redirect("/");
    })
    console.log(fname, lname, mails);
})
app.listen(process.env.PORT || 3000, function () {
    console.log("done");
});




// 1e473f143483e349d3db309b489a6193-us11

// f1ba57a006

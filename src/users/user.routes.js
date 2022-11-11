const express = require("express");
const User = require("./user.model");

const app = express.Router();


app.get("/", (req, res) => User.find().then((r) =>   res.send(r)));


app.post("/signup", async (req, res) => {
    let { email, password } = req.body;
    let exUser = await User.findOne({ email: email });

    try {
        console.log(exUser);
        if (exUser)
            res.send("ye email allready exist hota hai");
        else {
            let nv = await User.create({ ...req.body });
            res.send(`${nv._id}-${email}-${password}`);
        }

    }
    catch (e) {
        res.status(401).send(e);
    }




})

app.post("/login", async (req, res) => {
    let { email, password } = req.body;
    let user = await User.findOne({ email: email });
    try {
        if (user) {
            if (user.password == password) {
                console.log(user, password)
                res.send(`${user._id}-${email}-${password}`);

            }
            else {
                res.send("password galat hai");
            }

        }
        else
            res.send("pahale sign up karo");


    }
    catch (e) {
        res.status(401).send(e);
    }
})


module.exports = app;
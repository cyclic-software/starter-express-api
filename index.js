const express = require("express");
const app = express();
const nodemailer = require("nodemailer");

const email = mail.createTransport({
    host:"smtp.office365.com",
    port:587,
    auth:{
        user:"steamcraftteams@hotmail.com",
        pass:"Er030303"
    }
});
let message = "StealCraft Teams Tarafından Gönderirdi";
const mailOptions = {
    from: "steamcraftteams@hotmail.com",
    to: "muhammedemirisik04@gmail.com",
    subject:"StealCraft Feedback Info",
    text: message
};

email.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

let users = [
    {id:0,name:"Ramazan Enes ISIK",pass:"Er031202",active:true}
]

let ugt_items = [
    {id:0,name:"EnesCraft Welcome Texture Pack",imgURL:"",downloadURL:"",author:"Ramazan Enes ISIK"}
]

app.use(express.static("public"));
app.set("view engine","ejs");

app.get("/", function(req,res) {
    res.render("index",{
        user: users
    });
});

app.get("/feedback=:id", function(req,res) {
    const username = req.params.id.split("username=")[1];
});

app.get("/ugt", function(req,res) {
    res.render("ugt",{
        item: ugt_items
    });
});

app.get("/ugt=:id", function(req,res) {
    const item = ugt_items.find(u => u.id == req.params.id);
    res.render("ugt_item",item);
});

app.listen(3000,() => {
    console.log("Opened Server");
})

const express = require("express");
const app = express();
const mail = require("nodemailer");

const email = mail.createTransport({
    host:"smtp.office365.com",
    port:587,
    auth:{
        user:"steamcraftteams@hotmail.com",
        pass:"Er030303"
    }
});

email.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

app.get("/feedback=:id", function(req,res) {
    const username = req.params.id.split("username=")[1];
    const message1 = req.params.id.split("username=")[0];
    let message = "Username : " + username + ",Text : " + message1;
const mailOptions = {
    from: "steamcraftteams@hotmail.com",
    to: "muhammedemirisik04@gmail.com,isikramazanenes@gmail.com",
    subject:"StealCraft Feedback Info",
    text: message
};

    email.sendMail(mailOptions,function(err,info) {
    if(err) {
        console.log(err);
    } else {
        console.log(info.response);
    }


    res.send(info.response);
});
});

app.listen(3000,() => {
    console.log("Opened Server");
})

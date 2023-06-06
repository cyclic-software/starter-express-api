const express = require("express");
const app = express();
const port = 5000
const fs = require("fs");
const bodyParser =require("body-parser");

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: false}));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});
const password_list = [];
app.post("/",(req,res)=>{
    const value = req.body.value;
    const filename= "public/storage/password_list.txt";
    const data = {
        password: value
    };
    password_list.push(data)
    fs.writeFile(filename,JSON.stringify(password_list),err => {
        if(err) throw err;
        console.log(`${data.password} stored to database` );
    })
    res.redirect("/")

});
app.listen(process.env.PROT || port,()=>console.log(`Password-Saver running on port ${port}!`));

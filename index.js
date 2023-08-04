const express = require("express");
const app = express();

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

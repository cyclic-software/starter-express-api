const express = require("express");
const Cart = require("./cart.model");
const Product = require("../products/product.model")
const User = require("../users/user.model")


const Auth = async (req, res, next) => {
    let { token } = req.headers;

    let [email] = token.split("-");
    let user = await User.findOne({ email: email });
    try {
        if (token) {
            if (user.password == password) {
                req.userId = id;
                next();
            }
            else
                return res.send("please login ");

        } else {
            res.send("token nhi hai beedu please login ")
        }
    }
    catch (e) {
        res.send(e);
    }
}

const app = express.Router();
// app.use(Auth);


app.get("/",async (req, res) => {
    console.log("aaya");
    let carts = await Cart.find().populate("product").then((r)=>res.send(r)).catch((e)=>{
        res.send(e);
    });
});

app.post("/", async (req, res) => {
    let id = req.userId;
    try {

        let product = await Product.findById(req.body.product);

        if (product.quantity > req.body.quantity) {
            let item = await Cart.create({
                ...req.body,
                user: id
            })
            Product.findByIdAndUpdate({
                ...product,
                quantity: product.quantity - req.body.quantity
            })

            res.send(req.body);
        }
        else
            res.send("quantity is more than stock");

    }
    catch (e) {
        res.send(e);
    }

})

module.exports = app;
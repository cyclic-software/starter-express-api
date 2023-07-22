const mongoose = require('mongoose')
const Cart = require('../models/cart')
const jwt = require('jsonwebtoken')

module.exports.create_cart = async (req, res, next) => {
    const {product_id, quantity} = req.body
    
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], process.env.JWT_KEY);
    const user_id = decoded.id;

    const existingCartEntry = await Cart.findOne({ user_id, product_id });
    if (existingCartEntry !== null) {
        return res.status(404).json({ error: 'Product already in cart.' });
    }
    const cart = new Cart({user_id, product_id, quantity})
    await cart.save().then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({error:err.message})
    })
}

module.exports.get_carts = async (req, res) => {
    await Cart.find().then(e => {
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({error:err.message})
    })
}

module.exports.get_carts_by_id = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    await Cart.findById(_id).then(e => {
        res.status(200).json(e)
    }).catch(err => {
        res.status(404).json({error:err.message})
    })
}

module.exports.remove_cart = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    await Cart.findById(_id).then(e => {
        if(!e){
            return res.status(404).json({error:'can\'t delete cart not found.'})
        }
    })
    await Cart.findByIdAndDelete(_id).then(e => {
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({error: err.message})
    })
}

module.exports.update_cart = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    const data = req.body
    await Cart.findById(_id).then(e => {
        if(!e){
            return res.status(404).json({error:'can\'t update cart not found!'})
        }
    })
    await Cart.findByIdAndUpdate(_id, data, {new: true}).then(e =>{
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({error: err.message})
    })
}

module.exports.get_carts_by_user_id = async (req, res) => {
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');
    const decoded = jwt.verify(token[1], process.env.JWT_KEY);
    const user_id = decoded.id;
    await Cart.find({user_id}).then(e => {
        res.status(200).json(e)
    }).catch(err => {
        res.status(404).json({error:err.message})
    })
}

module.exports.add_one_quantity = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    await Cart.findById(_id).then(e => {
        if(!e){
            return res.status(404).json({error:'can\'t update cart not found!'})
        }
    })
    await Cart.findByIdAndUpdate(_id, {$inc: {quantity: 1}}, {new: true}).then(e =>{
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({error: err.message})
    })
}

module.exports.remove_one_quantity = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    await Cart.findById(_id).then(e => {
        if(!e){
            return res.status(404).json({error:'can\'t update cart not found!'})
        }
    })
    await Cart.findByIdAndUpdate(_id, {$inc: {quantity: -1}}, {new: true}).then(e =>{
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({error: err.message})
    })
}
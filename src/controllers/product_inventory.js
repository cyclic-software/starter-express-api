const Product_inventory = require('../models/product_inventory.js')
const mongoose = require('mongoose')

module.exports.AllProduct_inventorys = (req, res) => {
    Product_inventory.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}
module.exports.CreateProduct_inventory = async (req, res, next) => {
    const body = req.body
    
    
    let product_inventory = new Product_inventory({
        quantity: body.quantity,
    })
    product_inventory.save()
    .then(response => {
        res.json({
           response
        })
    })
    .catch(error => {
        
        res.json({
            message: 'An error Occured!'
        })
    })
}
module.exports.UpdateProduct_inventory = async (req, res) => {
    let _id = new mongoose.Types.ObjectId(req.params.id)
    const body = req.body
    await Product_inventory.findOneAndUpdate({_id:_id},body,{new:true}).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        return res.json({message: "Error"})
    })
}
module.exports.DeleteProduct_inventory = async (req, res) => {
    let _id = new mongoose.Types.ObjectId(req.params.id)
    await Product_inventory.deleteOne({_id:_id}).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        return res.json({message: "Error"})
    })
}
module.exports.getInventory = async (req, res) => {
    let _id = new mongoose.Types.ObjectId(req.params.id)
    await Product_inventory.findOne({_id:_id}).then(e => {
        return res.json(e)
    }).catch(err => {
        return res.json({message: "Error"})
    })
}
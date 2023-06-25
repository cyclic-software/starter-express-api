const Product_category = require('../models/product_category.js')
const mongoose = require('mongoose')

module.exports.AllProduct_categorys = (req, res) => {
    Product_category.find()
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
module.exports.CreateProduct_category = async (req, res, next) => {
    let body = req.body

    let product_category = new Product_category({
        name: body.name,
        desc: body.desc,
    })
    product_category.save()
    .then(response => {
        res.json({
        response
        })
    })
    .catch(error => {
        console.log(error)
        res.json({
            message: 'An error Occured!'
        })
    })
}
module.exports.UpdateProduct_category = async (req, res) => {
    let _id =new mongoose.Types.ObjectId(req.params.id)
    const body = req.body
    await Product_category.findOneAndUpdate({_id:_id},body,{new:true}).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        return res.json({message: "Error"})
    })
}
module.exports.DeleteProduct_category = async (req, res) => {
    let _id =new mongoose.Types.ObjectId(req.params.id)
    await Product_category.deleteOne({_id:_id}).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        return res.json({message: "Error"})
    })
}
module.exports.getCategory = async (req, res) => {
    let _id = new mongoose.Types.ObjectId(req.params.id)
    await Product_category.findOne({_id:_id}).then(e => {
        return res.json(e)
    }).catch(err => {
        return res.json({message: "Error"})
    })
}
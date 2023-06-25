const Discount = require('../models/discount.js')
const mongoose = require('mongoose')

module.exports.AllDiscounts = (req, res) => {
    Discount.find()
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
module.exports.CreateDiscount = async (req, res, next) => {
    const body = req.body
    
    
    let discount = new Discount({
        name: body.name,
        desc: body.desc,
        active:body.active,
        discount_percent:body.discount_percent
    })
    discount.save()
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
module.exports.UpdateDiscount = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    const body = req.body

    await Discount.findOneAndUpdate({_id:_id},body,{new:true}).then(e => {
        return res.json(e)
    }).catch(err => {
        return res.json({message: "Error"})
    })
}
module.exports.DeleteDiscount = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)

    await Discount.deleteOne({_id:_id}).then(e => {
        return res.json(e)
    }).catch(err => {
        return res.json({message: "Error"})
    })
}
module.exports.getDiscount = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    await Discount.findOne({_id:_id}).then(e => {
        return res.json(e)
    }).catch(err => {
        return res.json({message: "Error"})
    })
}
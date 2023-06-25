const Order_items = require('../models/Order_items')
const mongoose = require('mongoose')

module.exports.Create_order_item = async (req, res) => {
    const order_item = req.body
    await add_order_item(order_item).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log('err',err)
        return res.status(401).json(err)
    })
}

const add_order_item = async ({order_id, product_id, quantity}) => {
    const newOrder_item = new Order_items({
        order_id,
        product_id,
        quantity
    })
    await newOrder_item.save()
    return newOrder_item
}

module.exports.Read_order_item = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    await Order_items.findById(_id).then(e => {
        if(!e){
            return res.status(404).json({error:"order item not found"})
        }
        return res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        return res.status(401).json({error:err.message})
    })
}

module.exports.Read_order_items = async (req, res) => {
    await Order_items.find().then(e =>{
        return res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        return res.status(401).json({error:err.message})
    })
}

module.exports.Delete_order_item = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    const oi = await Order_items.findById(_id)
    if(!oi){
        return res.status(404).json({error:'can\'t delete order item not found'})
    }
    await Order_items.findByIdAndDelete(_id).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        return res.status(401).json({error:err.message})
    })
}

module.exports.Update_order_item = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    const order_item = req.body
    const oi = await Order_items.findById(_id)
    if(!oi){
        return res.status(404).json({error:'can\'t update order item not found'})
    }
    await Order_items.findByIdAndUpdate(_id,order_item,{new:true}).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        return res.status(401).json({error:err.message})
    })
}
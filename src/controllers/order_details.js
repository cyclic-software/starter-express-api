const Order_details = require('../models/Order_details')
const mongoose = require('mongoose')

//create
module.exports.Create_order_details = async (req,res)=>{
    let {user_id, total, payment_id} = req.body
    // user_id = mongoose.Types.ObjectId(user_id)
    await addOrderDetails({user_id,total,payment_id}).then(async e =>{
        return res.status(200).json(e)
    }).catch(err => {
        console.log('err', err.message)
        return res.status(401).json({error: err.message})
    })
}
const addOrderDetails = async ({user_id, total, payment_id}) =>{
    const newOrderDetails = new Order_details({
        user_id,
        total,
        payment_id
    })
    await newOrderDetails.save()
    return newOrderDetails
}
//read
module.exports.Read_order_details = async (req, res) => {
    await Order_details.find().then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log('err', err.message)
        return res.status(401).json({error:err.message})
    })
}
module.exports.Read_order_detail = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    await Order_details.findById(_id).then(e => {
        if(!e){
            return res.status(404).json({error:'not found'})
        }
        return res.status(200).json(e)
    }).catch(err =>  {
        console.log('err',err.message)
        return res.status(401).json({error:err.message})
    })
}

module.exports.Delete_order_details = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    const od = await Order_details.findById(_id)
    if (!od){
        return res.status(404).json({error:'can\'t delete order detail not found'})
    }
    await Order_details.findByIdAndDelete(_id).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log('err', err.message)
        return res.status(404).json({error:err.message})
    })
}

module.exports.Update_order_details = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    const {user_id, total, payment_id} = req.body
    const od = await Order_details.findById(_id)
    if (!od){
        return res.status(404).json({error:'con\'t update order detail not found'})
    }
    await Order_details.findByIdAndUpdate(_id,{user_id, total, payment_id},{new:true}).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log('err',err)
        return res.status(401).json({error:err.message})
    })
}
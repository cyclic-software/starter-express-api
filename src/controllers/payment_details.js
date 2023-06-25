const mongoose = require('mongoose')
const Payment_details = require('../models/Payment_details')

module.exports.Create_payment_details = async (req, res) => {
    const payment_detail = req.body
    await add_payment_detail(payment_detail).then(e =>{
        return res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        return res.status(401).json({error:err.message})
    })
}

const add_payment_detail = async ({order_id, amount, provider, status})=>{
    const newPayment_detail = new Payment_details({
        order_id,
        amount,
        provider,
        status
    })
    await newPayment_detail.save()
    return newPayment_detail
}

module.exports.Read_payment_details = async (req, res) => {
    await Payment_details.find().then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        return res.status(401).json({error:err.message})
    })
}
module.exports.Read_payment_detail = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    await Payment_details.findById(_id).then(e => {
        if(!e){
            return res.status(404).json({error:'payment detail not found'})
        }
        return res.status(200).json(e)
    }).catch(err => {
        res.status(401).json({error:err.message})
    })
}

module.exports.Delete_payment_detail = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    await Payment_details.findById(_id).then(e => {
        if(!e){
            return res.status(404).json({error:'can\'t delete payment detail not found.'})
        }
    })
    await Payment_details.findByIdAndDelete(_id).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        return res.status(401).json({error:err.message})
    })
}

module.exports.Update_payment_detail = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    const data = req.body
    await Payment_details.findById(_id).then(e => {
        if(!e){
            return res.status(404).json({error:'can\'t delete payment detail not found.'})
        }
    })
    await Payment_details.findByIdAndUpdate(_id,data,{new:true}).then(e => {
        return res.status(200).json(e)
    }).catch(err => {
        return res.status(401).json({error:err.message})
    })
}
const mongoose = require('mongoose')
const SubCategory = require('../models/subcategory')

module.exports.add_subcategory = async (req, res) => {
    const body = req.body
    const subcategory = new SubCategory(body)
    await subcategory.save().then(e => {
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({error:err.message})
    })
}

module.exports.get_subcategory = async (req, res) => {
    SubCategory.find().then(e => {
        res.status(200).json({
            response: e
        })
    }).catch(err => {
        console.log(err.message)
        res.status(404).json({error: err.message})
    })
}

module.exports.get_subcategory_by_id = async (req, res) => {
    const _id = mongoose.Types.ObjectId(req.params.id)
    SubCategory.findById(_id).then(e => {
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(404).json({error: err.message})
    })
}

module.exports.get_subcategory_by_main_category = async (req, res) => {
    const id = req.params.id
    SubCategory.find({main_category: id}).then(e => {
        res.status(200).json({
            response: e
        })
    }).catch(err => {
        console.log(err.message)
        res.status(404).json({error: err.message})
    })
}

module.exports.delete_subcategory = async (req, res) => {
    const _id = mongoose.Types.ObjectId(req.params.id)
    SubCategory.findByIdAndDelete(_id).then(e => {
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({error: err.message})
    })
}

module.exports.update_subcategory = async (req, res) => {
    const _id = mongoose.Types.ObjectId(req.params.id)
    const data = req.body
    SubCategory.findByIdAndUpdate(_id, data, {new: true}).then(e => {
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({error: err.message})
    })
}
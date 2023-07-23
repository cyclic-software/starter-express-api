const mongoose = require('mongoose')
const AdsSlider = require('../models/ads_slider')

module.exports.create_ads_slider = async (req, res) => {
    const {image} = req.body
    
    const ad_slider = new AdsSlider({image})
    await ad_slider.save().then(e => {
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({error:err.message})
    })
}

module.exports.get_ads_sliders = async (req, res) => {
    await AdsSlider.find().then(e => {
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({error:err.message})
    })
}

module.exports.get_ads_sliders_by_id = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    await AdsSlider.findById(_id).then(e => {
        res.status(200).json(e)
    }).catch(err => {
        res.status(404).json({error:err.message})
    })
}

module.exports.remove_ads_slider = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    await AdsSlider.findById(_id).then(e => {
        if(!e){
            return res.status(404).json({error:'can\'t delete ads slider not found.'})
        }
    })
    await AdsSlider.findByIdAndDelete(_id).then(e => {
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({error: err.message})
    })
}

module.exports.update_ads_slider = async (req, res) => {
    const _id = new mongoose.Types.ObjectId(req.params.id)
    const data = req.body
    await AdsSlider.findById(_id).then(e => {
        if(!e){
            return res.status(404).json({error:'can\'t update ads slider not found!'})
        }
    })
    await AdsSlider.findByIdAndUpdate(_id, data, {new: true}).then(e =>{
        res.status(200).json(e)
    }).catch(err => {
        console.log(err.message)
        res.status(401).json({error:err.message})
    })
}
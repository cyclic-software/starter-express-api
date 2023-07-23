const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AdsSlider = new Schema({
    image:String
}, { timeseries: true })


module.exports = mongoose.model.AdsSlider || mongoose.model("AdsSlider", AdsSlider);
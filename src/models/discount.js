const mongoose = require('mongoose')
const Schema = mongoose.Schema


const discountSchema = new Schema({
    name: {
        type: String,
        required:true,
    },
    desc: {
        type: String,
        required:true,
    },
    discount_percent: {
        type: Number,
        default:1,
        required:true,

    },
    active: {
        type: Boolean,
        default:false,
    }
}, { timeseries: true })


const Discount = mongoose.model('Discount', discountSchema)
module.exports = Discount
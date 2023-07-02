const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Productschema = new Schema({
    name: {
        type: String,
        required:true
    },
    imageSrc: {
        type: Array,
        default: []
    },
    desc: {
        type: String,
        required:true
    },
    quantity:{
        type: Number,
        default: 0
    },
    SKU: {
        type: String,
        required:true,
        unique:true
    },
    category_id: {
        type: String,
    },
    price: {
        type:Number,
        default:0
    },
    discount_id: {
        type: String
    }
   
}, { timeseries: true })


module.exports = mongoose.model.Product || mongoose.model("Product", Productschema);
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Productschema = new Schema({
    name: {
        type: String,
        required:true
    },
    desc: {
        type: String,
        required:true
    },
    SKU: {
        type: String,
        required:true,
        unique:true

    },
    category_id: {
        type: String,
       
    },
    inventory_id: {
        type: String,
        default:0
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
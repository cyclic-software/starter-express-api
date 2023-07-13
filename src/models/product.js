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
        type: Object,
        default:{
            color:'white',
            type:'cotton',
            brand:{
                name:'nike',
                logo:'#'
            },
            descreption:'high quality cloth.'
        }
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
    price_before: {
        type:Number,
        default:0
    },
    price_after: {
        type: Number,
        default: 0
    },
    sizes: {
        type:Object,
        default: {
            s:0,
            m:0,
            l:0,
            xl:0,
            xxl:0
        }
    },
    subCategory: {
        type:String
    },
    typeOfProduct:{
        type: String,
    }
}, { timeseries: true })


module.exports = mongoose.model.Product || mongoose.model("Product", Productschema);
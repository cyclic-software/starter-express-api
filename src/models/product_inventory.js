const mongoose = require('mongoose')
const Schema = mongoose.Schema

const inventorySchema = new Schema({
    quantity: {
        type: Number
    },

}, { timeseries: true })


const Product_inventory = mongoose.model('Product_inventory', inventorySchema)
module.exports = Product_inventory
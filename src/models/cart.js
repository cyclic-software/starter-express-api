const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CartSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    product_id: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
})


module.exports = mongoose.model.Cart || mongoose.model("Cart", CartSchema);
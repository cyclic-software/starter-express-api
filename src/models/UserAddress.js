const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userAddressSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    address_line1: {
        type: String
    },
    address_line2: {
        type: String
    },
    city: {
        type: String
    },
    postal_code: {
        type: String
    },
    country: {
        type: String
    },
    telephone: {
        type: Date
    },
    mobile: {
        type: Date
    },
}, {timeseries: true})

const UserAddress = mongoose.model('user_address', userAddressSchema)
module.exports = UserAddress
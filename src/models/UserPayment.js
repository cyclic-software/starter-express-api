const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userPaymentSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    payment_type: {
        type: String
    },
    provider: {
        type: String
    },
    account_no: {
        type: String
    },
    expiry: {
        type: Date
    },
}, {timeseries: true})

const UserPayment = mongoose.model('user_payment', userPaymentSchema)
module.exports = UserPayment
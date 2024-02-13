const mongoose = require('mongoose')

const doctorInfoSchema = new mongoose.Schema({
    doctor: {
        type: String,
        ref: 'doctors',
        default: null
    },
    rating: {
        type: Number,
        default: 0,
        enum: [0, 1, 2, 3, 4, 5]
    },
    experience: {
        type: String
    },
    category: {
        type: String
    },
    perAppointmentCharges: {
        type: Number
    },
    numberOfAppointmentTillNow: {
        type: Number,
        default: 0
    },
    followers:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('doctorInformation', doctorInfoSchema)
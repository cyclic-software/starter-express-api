const mongoose = require('mongoose')
const { APPOINTMENT_METHOD, APPOINTMENT_STATUS } = require('../constant/constant')

const appointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctors",
        default: null
    },
    status: {
        type: String,
        default: APPOINTMENT_STATUS.PENDING,
        enum: [APPOINTMENT_STATUS.COMPLETED, APPOINTMENT_STATUS.PENDING]
    },
    appointmentMethod: {
        type: String,
        default: APPOINTMENT_METHOD.TEXTCHAT,
        enum: [APPOINTMENT_METHOD.AUDIOCHAT, APPOINTMENT_METHOD.TEXTCHAT, APPOINTMENT_METHOD.VIDEOCHAT]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('appointments', appointmentSchema)
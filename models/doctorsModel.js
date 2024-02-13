const mongoose = require('mongoose')
const { DOCTOR_STATUS } = require('../constant/constant')

const doctorSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    tenure: {
        type: String,
    },
    doctorRegisterNo: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
    },
    email: {
        type: String
    },
    doctorDegree: {
        type: String
    },
    address: {
        type: String
    },
    stateMedCouncil: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: DOCTOR_STATUS.WAITING_APPROVAL,
        enum: [DOCTOR_STATUS.APPROVED, DOCTOR_STATUS.REJECTED, DOCTOR_STATUS.WAITING_APPROVAL]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('doctors', doctorSchema)
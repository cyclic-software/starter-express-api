const mongoose = require('mongoose')
const { ROLES } = require('../constant/constant')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    fullName: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctors",
        default: null
    },
    role: {
        type: String,
        default: ROLES.PATIENT,
        enum: [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT]
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    createdAt: {
        type: Date,
        default: Date.now()
    },
})

module.exports = mongoose.model('users', userSchema)
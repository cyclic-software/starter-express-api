import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: false,
        unique: false
    },
    firstName: {
        type: String,
        required: false,
        min: 3,
        max: 255
    },
    lastName: {
        type: String,
        required: false,
        min: 3,
        max: 255
    },
    dateOfBirth: {
        type: Number,
        required: false
    },
    otherName: {
        type: String,
        required: false,
        min: 3,
        max: 255
    },
    mobile: {
        type: String,
        required: false,
        unique: true,
        max: 16
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    profilePhoto: {
        type: String,
        default: ''
    },
    coverPhoto: {
        type: String,
        default: ''
    },
    followers: {
        type: Array,
        default: [],
    },
    following: {
        type: Array,
        default: [],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    identification: {
        type: String,
        min: 6        
    },
    city: {
        type: String,
        max: 255
    },
    town: {
        type: String,
        max: 255
    },
    state: {
        type: String,
        max: 255
    },
    from: {
        type: String,
        max: 255
    },
    relationship: {
        type: Number,
        enum: [1,2,3,4]
    }
},{timestamps: true});

export default mongoose.model('User', userSchema);
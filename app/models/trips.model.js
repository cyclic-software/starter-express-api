import mongoose from "mongoose";

const tripsSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
        unique: false
    },
    tripName: {
        type: String,
        require: true,
        unique: false
    },
    tripMembers: {
        type: Array,
        require: false,
        default: []
    },
    requests: {
        type: Array,
        require: false,
        default: []
    },
    teamSize: {
        type: Number,
        require: true,
    },
    gender: {
        type: Array,
        require: false,
        default: []
    },
    activities: {
        type: Array,
        require: false,
        default: []
    },
    location: {
        type: Array,
        default: []
    },
    tripType: {
        type: String,
        require: false,
    },
    tripDate: {
        type: Number,
        require: true,
    },
    tripCost: {
        type: Number,
        require: true, 
    },
    ageRange: {
        type: String,
        require: false
    },
    personalityDescription: {
        type: String,
        require: false,
        min: 6
    },
    note: {
        type: String,
        require: false,
    },
    tripImages: {
        type: Array,
        default: []
    },
    likes: {
        type: Array,
        default: []
    },
    comments: {
        type: Array,
        default: []
    },
    isPublic: {
        type: Boolean,
        require: true,
        default: true,
    }
}, {timestamps: true});

export default mongoose.model('Trip', tripsSchema);
import mongoose from 'mongoose'


const requestSchema = new mongoose.Schema({
    tripId: {
        type: 'string',
        required: true,
        
    },
    requesterId: {
        type: String,
        require: true,        
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    others: {
        type: Array,
        default: []
    },
    isApproved: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

export default mongoose.model('Requests', requestSchema);
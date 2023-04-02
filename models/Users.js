const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    user_id: {
        type: Number
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: [true, "No password provided"],
        unique: false,
    },
    birth_day: {
        type: Date
    },
    phone: {
        type: String
    },
    mobile: {
        type: String
    },
    
    join_date: {
        type: Date
    },
    last_login: {
        type: Date
    },
    last_login_ip:{
        type:String
    }, 
    level: {
        type: String
    },
    NAT_id:{
        type:String,
        unique:true
    },
    address:{
        type:String
    },
    HS_score:{
        type:Number
    }
}, { timeseries: true })

const User = mongoose.model('user', userSchema)
module.exports = User
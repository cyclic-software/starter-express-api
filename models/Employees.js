const mongoose = require('mongoose')
const Schema = mongoose.Schema

const employeeSchema = new Schema({
    user_id: {
        type: String
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
    NAT_id:{
        type:String,
        unique:true
    },
    address:{
        type:String
    },
    admin:{
        type:Boolean
    }
}, { timeseries: true })

const Employee = mongoose.model('employee', employeeSchema)
module.exports = Employee
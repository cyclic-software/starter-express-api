const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
    course_id: {
        type: String
    },
    course_name: {
        type: String
    },
    course_description: {
        type: String
    },
    course_credit: {
        type: Number
    }
}, {timeseries: true})

const Course = mongoose.model('course', courseSchema)
module.exports = Course
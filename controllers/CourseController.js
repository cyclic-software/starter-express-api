const Course = require('../models/Course')

const index = (req, res, next) => {
    Course.find()
    .then(respone => {
        res.json({
            respone
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

const show = (req, res, next) => {
    let id = req.body.id
    Course.findById(id)
    .then(respone => {
        res.json({
            respone
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

const store = (req, res, next) => {
    const body = req.body
    let course = new Course({
        course_id: body.course_id,
        course_name: body.course_name,
        course_description: body.course_description,
        course_credit: body.course_credit,
    })
    course.save()
    .then(respone => {
        res.json({
            message: 'Course added successfully'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

const update = (req, res, next) => {
    let id = req.body.id
    
    let updatedData = {
        course_id: req.body.course_id,
        course_name: req.body.course_name,
        course_description: req.body.course_description,
        course_credit: req.body.course_credit,
    }

    Course.findByIdAndUpdate(id, {$set: updatedData})
    .then(respone => {
        res.json({
            message: 'Course updated successfully'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

const destroy = (req, res, next) => {
    let id = req.body.id
    Course.findByIdAndDelete(id)
    .then(respone => {
        res.json({
            message: 'Course deleted successfully'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

module.exports = {
    index, show, store, update, destroy
}
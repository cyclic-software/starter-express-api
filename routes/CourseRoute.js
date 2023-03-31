const express = require('express')
const router = express.Router()

const CourseController = require('../controllers/CourseController')

router.get('/', CourseController.index)
router.post('/show', CourseController.show)
router.post('/store', CourseController.store)
router.post('/update', CourseController.update)
router.post('/delete', CourseController.destroy)

module.exports = router
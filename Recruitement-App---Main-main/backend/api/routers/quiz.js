const Quiz = require("../controllers/quiz")
const router = require("express").Router()

router.post("/create",Quiz.make)


router.post("/add",Quiz.addQuestion)

router.get("/view",Quiz.viewQuiz)

module.exports = router
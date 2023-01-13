const mongoose = require("mongoose")
const Quiz = require("../models/quiz")

exports.make = async (req,res)=>{
    const {title,subject} = req.body

    const quiz = new Quiz({
        _id : new mongoose.Types.ObjectId(),
        title,
        subject
    })
    quiz    
        .save()
            .then((quiz)=>{
                return res.status(201).json({
                    success:"true",
                    _id:quiz.id
                })
            })
}

exports.addQuestion = async (req,res)=>{
    const {id} = req.query
    const {question} = req.body

    Quiz.updateOne({_id:id},{$addToSet:{questions:question}})
        .then(()=>{
            return res.status(200).json({
                success:true,
                message:"Question added"
            })
        })
            .catch((err)=>{
                return res.status(500).json({
                    error:err.toString()
                })
            })
}

exports.viewQuiz = async (req,res)=>{
    const {id} = req.query
    Quiz.findById(id).then((quiz)=>{
        res.status(200).json({
            success:true,
            quiz
        })
    })
}


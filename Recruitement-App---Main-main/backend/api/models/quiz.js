const mongoose = require("mongoose");

const quizSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    name: { type: String },
    subject : {type:String},
    questions : [{
        title : { type:String},
        options : [{
            type:String
        }]

    }]
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);

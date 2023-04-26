const mongoose = require('mongoose');
const {
  convertToSlug,
} = require("../../utils");
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema(
  {
    feedback_text: { type: String, default:''  },
    feedback_type: { type: String, default:''},
    feedback_description: { type: String,default:'' },
    is_del: { type: Boolean, default: false }
   
  },
  {
    timestamps: true,
  },
);


FeedbackSchema.pre('aggregate', function() {
  // Add a $match state to the beginning of each pipeline.
  this.pipeline().unshift({ $match: { is_del: { $ne: true } } });
});

module.exports = mongoose.model('feedback', FeedbackSchema);

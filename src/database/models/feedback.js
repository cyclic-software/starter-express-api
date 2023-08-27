const mongoose = require('mongoose');
const {
  convertToSlug,
} = require("../../utils");
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema(
  {
    feedback_text: { type: String, default:''  },
    feeback_name: { type: String, default:''  },
    feeback_mobile: { type: String, default:''  },
    feeback_email: { type: String, default:''  },
    feedback_description: { type: String,default:'' },
    user : { type:  mongoose.Schema.Types.ObjectId, ref: 'users'  },

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

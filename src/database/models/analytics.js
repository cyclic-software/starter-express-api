const mongoose = require('mongoose');
const {
  convertToSlug,
} = require("../../utils");
const Schema = mongoose.Schema;

const AnalyticsSchema = new Schema(
  {
    poet_id : { type:  mongoose.Schema.Types.ObjectId, ref: 'poet'  },
    poet_name: { type: String ,default:''},
    post_id : { type:  mongoose.Schema.Types.ObjectId, ref: 'post'  },
    post_name: { type: String ,default:''},
    user_id : { type:  mongoose.Schema.Types.ObjectId, ref: 'user'  },
    user_name: { type: String ,default:''},
    user_email: { type: String ,default:''},
    user_mobile: { type: String ,default:''},
    category_id : { type:  mongoose.Schema.Types.ObjectId, ref: 'category'  },
    category_name: { type: String ,default:''},
    anallytics_type:{ type: String ,default:'like'},
    is_del: { type: Boolean, default: false }
   
  },
  {
    timestamps: true,
  },
);

AnalyticsSchema.pre('aggregate', function() {
  // Add a $match state to the beginning of each pipeline.
  this.pipeline().unshift({ $match: { is_del: { $ne: true } } });
});

module.exports = mongoose.model('analytics', AnalyticsSchema);

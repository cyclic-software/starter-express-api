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
AnalyticsSchema.post('save', async function(like) {


  var anallytics_type =  this.anallytics_type
  var poet_id =  this.poet_id
  var category_id =  this.category_id
  var post_id =  this.post_id
  // const postId = like.post;
  const count = await mongoose.model('analytics').countDocuments({ anallytics_type: anallytics_type,poet_id:poet_id, user_id:this.user_id});
  var updatedocument = {}
  var updatepostdocument = {}
  var updatepoetcount = {}
  if(anallytics_type == "like"){
    updatedocument.like = count
    updatepostdocument.likeCount = count
    updatepoetcount.likeCount = count
  }
  if(anallytics_type == "whishlist"){
    updatedocument.wishlist = count
    updatepostdocument.wishlistCount = count
    updatepoetcount.wishlistCount = count
  }
  if(anallytics_type == "view"){
    updatedocument.view = count
    updatepostdocument.view = count
    updatepoetcount.view = count
  }
  if(anallytics_type == "download"){
    updatedocument.download = count
    updatepostdocument.download = count
    updatepoetcount.download = count
  }
  if(anallytics_type == "share"){
    updatedocument.share = count
    updatepostdocument.share = count
    updatepoetcount.share = count
  }
  if(anallytics_type == "copy"){
    updatedocument.copy = count
    updatepostdocument.copy = count
    updatepoetcount.copy = count
  }
  await mongoose.model('post').findByIdAndUpdate({_id:mongoose.Types.ObjectId(post_id)}, { $set: updatepostdocument });
  await mongoose.model('poet').findByIdAndUpdate({_id:mongoose.Types.ObjectId(poet_id)}, { $set: updatepoetcount });
  await mongoose.model('category').findByIdAndUpdate({_id:mongoose.Types.ObjectId(category_id)}, { $set: updatedocument });
});
module.exports = mongoose.model('analytics', AnalyticsSchema);

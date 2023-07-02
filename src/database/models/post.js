const mongoose = require('mongoose');
const {
  convertToSlug,
} = require("../../utils");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    post_name: { type: String, required: true,unique:true },
    post_slug: { type: String, default:'',unique:true},
    post_action: { type: String, default:''},
    post_type: { type: String,default:'home' },
    post_description: { type: String,default:'' },
    is_post_has_button: { type: Boolean,default:false },
    post_button_text: { type: String,default:'' },
    category_name: { type: String,default:'' },
    category_slug : { type: String,default:'' },
    poet_id : { type:  mongoose.Schema.Types.ObjectId, ref: 'poet'  },
    category_id : { type:  mongoose.Schema.Types.ObjectId, ref: 'post'  },
    poet_name: { type:  String, default:''  },
    post_media_url: [String],
    post_tags: [String],
    is_del: { type: Boolean, default: false },
    is_admin_post: { type: Boolean, default: false },
    post_status: { type: String, enum: ['Draft', 'Published'],default: "Draft" },
    likeCount: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 },
    seo_title: { type: String,default:'' },
    seo_description: { type: String,default:'' },
    seo_media_url: { type: String,default:'' },
    seo_keywords: { type: String,default:'' },
    is_photo_with_lyrics: { type: Boolean, default: false }

  },
  {
    timestamps: true,
  },
);

PostSchema.pre('save', function (next) {
  // capitalize
  this.post_slug = convertToSlug(this.post_name);
  next();
});
PostSchema.pre('aggregate', function() {
  // Add a $match state to the beginning of each pipeline.
  this.pipeline().unshift({ $match: { is_del: { $ne: true } } });
});

PostSchema.pre('remove', async function(next) {
  const postId = this._id;
  await mongoose.model('postlike').deleteMany({ post: postId });
  await mongoose.model('postwishlist').deleteMany({ post: postId });
  next();
});


module.exports = mongoose.model('post', PostSchema);

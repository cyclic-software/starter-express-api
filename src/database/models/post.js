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
    post_media_url: [String],
    post_tags: [String],
    is_del: { type: Boolean, default: false },
    is_admin_post: { type: Boolean, default: false },
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

module.exports = mongoose.model('post', PostSchema);

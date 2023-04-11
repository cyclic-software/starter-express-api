const mongoose = require('mongoose');
const {
  convertToSlug,
} = require("../../utils");
const Schema = mongoose.Schema;

const TagSchema = new Schema(
  {
    tag_name: { type: String, required: true,unique:true },
    tag_slug: { type: String, default:'',unique:true},
    tag_description: { type: String,default:'' },
    tag_media_url: { type: String,default:'' },
    tag_media_id: { type: String,default:'' },
    is_del: { type: Boolean, default: false }
   
  },
  {
    timestamps: true,
  },
);

TagSchema.pre('save', function (next) {
  // capitalize
  this.tag_slug = convertToSlug(this.tag_name);
  
  next();
});
TagSchema.pre('aggregate', function() {
  // Add a $match state to the beginning of each pipeline.
  this.pipeline().unshift({ $match: { is_del: { $ne: true } } });
});

module.exports = mongoose.model('tag', TagSchema);

const mongoose = require('mongoose');
const {
  convertToSlug,
} = require("../../utils");
const Schema = mongoose.Schema;

const MediaSchema = new Schema(
  {
    media_name: { type: String, required: true },
    media_type: { type: String,    enum: ['image', 'pdf','video'],    default:'image' },
    media_file: { type: String, default:''},
    full_path: { type: String, default:''},
    media_slug: { type: String, default:''},
    media_description: { type: String,default:'' },
    is_del: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);


MediaSchema.pre('save', function (next) {
  // capitalize
  this.media_slug = convertToSlug(this.media_name);
  // this.full_path = "http://localhost:8086/uploads/chhand/"+this.media_file;
  next();
});

MediaSchema.pre('aggregate', function() {
  // Add a $match state to the beginning of each pipeline.
  this.pipeline().unshift({ $match: { is_del: { $ne: true } } });
});


module.exports = mongoose.model('media', MediaSchema);

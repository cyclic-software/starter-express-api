const mongoose = require('mongoose');
const {
  convertToSlug,
} = require("../../utils");
const Schema = mongoose.Schema; 

const MediaSchema = new Schema(
  {
    media_type: { type: String,    enum: ['image', 'pdf','video'],    default:'image' },
    media_url: { type: String, default:''},
    folder_name: { type: String, default:''},
    is_del: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);




MediaSchema.pre('aggregate', function() {
  // Add a $match state to the beginning of each pipeline.
  this.pipeline().unshift({ $match: { is_del: { $ne: true } } });
});


module.exports = mongoose.model('media', MediaSchema);

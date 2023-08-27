const mongoose = require('mongoose');
const {
  convertToSlug,
} = require("../../utils");
const Schema = mongoose.Schema;

const SliderSchema = new Schema(
  {
    slider_name: { type: String, required: true,unique:true },
    slider_slug: { type: String, default:'',unique:true},
    slider_action: { type: String, default:'post'},
    slider_type: { type: String,default:'home' },
    slider_description: { type: String,default:'' },
    slider_media_url: { type: String,default:'' },
    slider_media_mime_type: { type: String,default:'image' },
    is_slider_has_button: { type: Boolean,default:false },
    slider_button_text: { type: String,default:'' },
    is_del: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

SliderSchema.pre('save', function (next) {
  // capitalize
  this.slider_slug = convertToSlug(this.slider_name);
  next();
});
SliderSchema.pre('aggregate', function() {
  // Add a $match state to the beginning of each pipeline.
  this.pipeline().unshift({ $match: { is_del: { $ne: true } } });
});

module.exports = mongoose.model('slider', SliderSchema);

const mongoose = require('mongoose');
const {
  convertToSlug,
} = require("../../utils");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    category_name: { type: String, required: true,unique:true },
    category_english_name: { type: String,default:''   },
    category_slug: { type: String, default:'',unique:true},
    category_description: { type: String,default:'' },
    category_media_url: { type: String,default:'' },
    category_media_id: { type: String,default:'' },
    is_del: { type: Boolean, default: false },
    download:{type:Number,default:0},
    share:{type:Number,default:0},
    like:{type:Number,default:0},
    copy:{type:Number,default:0},
    view:{type:Number,default:0},
    wishlist:{type:Number,default:0},
  },
  {
    timestamps: true,
  },
);

CategorySchema.pre('save', function (next) {
  // capitalize
  this.category_slug = convertToSlug(this.category_name);
  
  next();
});
CategorySchema.pre('aggregate', function() {
  // Add a $match state to the beginning of each pipeline.
  this.pipeline().unshift({ $match: { is_del: { $ne: true } } });
});

module.exports = mongoose.model('category', CategorySchema);

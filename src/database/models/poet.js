const mongoose = require('mongoose');
const {
  convertToSlug,
} = require("../../utils");
const Schema = mongoose.Schema;

const galleryschema = new mongoose.Schema({
   
     _id: { type: mongoose.Schema.Types.ObjectId },
  media_url:{ type: String,default:''},
  media_type:{ type: String,default:''},
  is_featured:{ type: Boolean,default: false},
  },{timestamps:true});
const CategorySchema = new Schema(
  {
    poet_name: { type: String, required: true,unique:true },
    poet_slug: {  type: String, default:'',unique:true},
    poet_description: { type: String,default:'' },
    poet_birthdate: { type: String,default:'' },
    poet_died_date: { type: String,default:'' },
    poet_died_place: { type: String,default:'' },
    poet_birthplace: { type: String,default:'' },
    poet_home_town: { type: String,default:'' },
    poet_ancestary: { type: String,default:'' },
    poet_school_name: [String],
    poet_address: { type: String,default:'' },
    poet_nickname: { type: String,default:'' },
    poet_hobbies: [String],
    poet_books: [String],
    poet_future_books: [String],
    poet_occupations: [String],
    poet_parent: [String],
    poet_languages_known: [String],
    poet_nationality: [String],
    poet_spouse: [String],
    poet_children: [String],
    category_idlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category' }],
    category_textlist:  [String],
    refrences: [String],
    poet_gallery:[galleryschema],

    awards: [String], 
    profile_media_url: {type:String},
    is_del: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  },
);

CategorySchema.pre('save', function (next) {
  // capitalize
  this.poet_slug = convertToSlug(this.poet_name);
  
  next();
});
CategorySchema.pre('updateOne', function (next) {
  // capitalize
  const update = this.getUpdate();
  update.$set.poet_slug = convertToSlug(update.$set.poet_name);
  next();
});
CategorySchema.pre('aggregate', function() {
  // Add a $match state to the beginning of each pipeline.
  this.pipeline().unshift({ $match: { is_del: { $ne: true } } });
});

module.exports = mongoose.model('poet', CategorySchema);

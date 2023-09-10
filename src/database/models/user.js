const mongoose = require('mongoose');
const {
  convertToSlug,
} = require("../../utils");
const Schema = mongoose.Schema;


const UserSchema = new Schema(
  {
    user_name: { type: String ,default:''},
    // TODO useruniquename: { type: String, required: true },
    user_mobile: { type: String, required: true,unique:true },
    user_email: { type: String ,default:''},
    user_birthdate: { type: String ,default:''},
    user_slug: { type: String, default:''},
    user_media_url: { type: String,default:'' },
    is_user_has_button: { type: Boolean,default:false },
    user_fcm_token: { type: String,default:false },
    user_device_info: { type: Object },
    user_role: { type: String,enum: ['admin', 'author','publisher','editor','poet','creator','public'],default:'public' },
    
    is_del: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

UserSchema.pre('save', function (next) {
  // capitalize
  this.user_slug = convertToSlug(this.user_name);
  next();
});
UserSchema.pre('aggregate', function() {
  // Add a $match state to the beginning of each pipeline.
  this.pipeline().unshift({ $match: { is_del: { $ne: true } } });
});

module.exports = mongoose.model('user', UserSchema);

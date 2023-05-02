const mongoose = require('mongoose');
const {
  convertToSlug,
} = require("../../utils");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    title: { type: String, required: true, },
    body: { type: String,default:'' },
    type: { type: String,default:'General',enum:["Single","General"] },
    media_url: { type: String,default:'' },
    data: { type: Object },
    user_id_list: [ String],
    user_fcm_token_list: [ String],
    is_del: { type: Boolean, default: false }
   
  },
  {
    timestamps: true,
  },
);

NotificationSchema.pre('aggregate', function() {
  // Add a $match state to the beginning of each pipeline.
  this.pipeline().unshift({ $match: { is_del: { $ne: true } } });
});

module.exports = mongoose.model('notification', NotificationSchema);

const mongoose = require('mongoose');
const {
  convertToSlug,
} = require("../../utils");
const Schema = mongoose.Schema;

const ContactusSchema = new Schema(
  {
    contactus_name: { type: String },
    contact_mobile: { type: String,default:'' },
    contact_email: { type: String,default:'' },
    is_del: { type: Boolean, default: false }
   
  },
  {
    timestamps: true,
  },
);


ContactusSchema.pre('aggregate', function() {
  // Add a $match state to the beginning of each pipeline.
  this.pipeline().unshift({ $match: { is_del: { $ne: true } } });
});

module.exports = mongoose.model('contactus', ContactusSchema);

const mongoose = require('mongoose');
const {
  convertToSlug,
} = require("../../utils");
const Schema = mongoose.Schema;

const AdminregistrySchema = new Schema(
  {
    adminregistry_name: { type: String, required: true,unique:true },
    adminregistry_email: { type: String, required: true,unique:true },
    adminregistry_mobile: { type: String,unique:true },
    adminregistry_password: { type: String,required: true },
    adminregistry_slug: { type: String, default:'',unique:true},
    adminregistry_description: { type: String,default:'' },
    social_link: {type:Object},
    is_del: { type: Boolean, default: false }
   
  },
  {
    timestamps: true,
  },
);

AdminregistrySchema.pre('save', function (next) {
  // capitalize
  this.adminregistry_slug = convertToSlug(this.adminregistry_name);
  
  next();
});
AdminregistrySchema.pre('aggregate', function() {
  // Add a $match state to the beginning of each pipeline.
  this.pipeline().unshift({ $match: { is_del: { $ne: true } } });
});

module.exports = mongoose.model('adminregistry', AdminregistrySchema);

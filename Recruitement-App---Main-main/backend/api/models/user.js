const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

    name: { type: String },

    email: { type: String },

    mobile: { type: Number },

    password:{type:String}
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

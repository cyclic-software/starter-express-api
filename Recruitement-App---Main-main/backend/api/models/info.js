const mongoose = require("mongoose");

const infoSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,

  info : {type:String}
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Info", infoSchema);

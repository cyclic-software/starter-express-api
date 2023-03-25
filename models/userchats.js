const mongoose = require("mongoose");

const userChats = new mongoose.Schema({
  sender_id: { type: String },
  recevier_id: { type: String },
  message: { type: String },
  type: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date },
});

module.exports = mongoose.model("userchats_tbls", userChats);

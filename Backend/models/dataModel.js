const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => Math.floor(Math.random() * 100000).toString(),
  },
  name: { type: String, default: "Name" },
  img: { type: String, default: "placeholder.jpg" },
  url: { type: String, default: "#" },
  description: { type: String, default: "Example description" },
  type: { type: String, default: "cat" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Data", dataSchema);

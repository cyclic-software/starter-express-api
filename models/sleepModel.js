const mongoose = require("mongoose");

const sleepSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  deepSleepTime: {
    type: Number,
    required: true,
  },
  shallowSleepTime: {
    type: Number,
    required: true,
  },
  wakeTime: {
    type: Number,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  stop: {
    type: Date,
    required: true,
  },
  REMTime: {
    type: Number,
    required: true,
  },
  naps: {
    type: Number,
    required: true,
  },
  sleepQuality: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Sleep", sleepSchema);

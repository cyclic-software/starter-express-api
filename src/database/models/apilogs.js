const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ApiLogsSchema = new Schema(
  {
    BaseUrl: { type: String, default: "" },
    ReqMethod: { type: String, default: "" },
    ReqBody: {},
    ReqHeaders: {},
    ReqParams: {},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("appapilogs", ApiLogsSchema);

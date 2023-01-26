"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var verificationSchema = new _mongoose["default"].Schema({
  code: {
    type: String,
    require: true
  },
  user: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User"
  }]
});
var Verification = _mongoose["default"].model("Verification", verificationSchema);
var _default = Verification;
exports["default"] = _default;
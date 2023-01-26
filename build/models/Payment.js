"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var paymentSchema = new _mongoose["default"].Schema({
  merchantUid: {
    type: String,
    require: true
  },
  impUid: {
    type: String,
    require: true
  },
  amount: {
    type: Number,
    require: true,
    "default": 0
  },
  cancelAmount: {
    type: Number,
    require: true,
    "default": 0
  },
  payMethod: {
    type: String,
    require: true,
    "default": "card"
  },
  status: {
    type: String,
    "default": "unpaid"
  }
}, {
  timestamps: true
});
var Payment = _mongoose["default"].model("Order", paymentSchema);
var _default = Payment;
exports["default"] = _default;
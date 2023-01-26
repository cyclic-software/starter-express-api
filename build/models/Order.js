"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var orderSchema = new _mongoose["default"].Schema({
  merchantUid: {
    type: String,
    require: true,
    "default": "merchant_" + Date.now()
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
  },
  item: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Item"
  }
});
var Order = _mongoose["default"].model("Order", orderSchema);
var _default = Order;
exports["default"] = _default;
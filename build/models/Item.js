"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
//Item을 꼭 지정 해줘야 할까?

var itemSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    require: true
  },
  amount: {
    type: Number,
    require: true
  },
  itemImg: {
    type: String,
    "default": "image/cafe_logo.png"
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  createdAt: {
    type: Date,
    required: true,
    "default": Date.now
  },
  meta: {
    views: {
      type: Number,
      "default": 0,
      required: true
    },
    rating: {
      type: Number,
      "default": 0,
      required: true
    }
  }
});
var Item = _mongoose["default"].model("Item", itemSchema);
var _default = Item;
exports["default"] = _default;
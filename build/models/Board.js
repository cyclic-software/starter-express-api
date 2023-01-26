"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var boardSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30
  },
  boardImg: {
    type: String,
    "default": "image/cafe_logo.png"
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxLength: 300
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
  },
  owner: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
});
var Board = _mongoose["default"].model("Board", boardSchema);
var _default = Board;
exports["default"] = _default;
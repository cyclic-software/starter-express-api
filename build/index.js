"use strict";

require("regenerator-runtime");
require("dotenv/config");
require("./db");
require("./models/Board");
require("./models/User");
require("./models/Order");
require("./models/Item");
var _server = _interopRequireDefault(require("./server"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var PORT = process.env.PORT || 5050;
var handleListener = function handleListener() {
  console.log("Hello! let's start http://localhost:".concat(PORT));
};
_server["default"].listen(PORT, handleListener);
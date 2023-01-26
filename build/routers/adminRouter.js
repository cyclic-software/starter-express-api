"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _adminContoller = require("../controllers/adminContoller");
var _middlewares = require("../middlewares");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var adminRouter = _express["default"].Router();
adminRouter.route("/").all(_middlewares.adminOnlyMiddleware).get(_adminContoller.getAdminPage);
adminRouter.route("/login").get(_adminContoller.getAdminLogin).post(_adminContoller.postAdminLogin);
var _default = adminRouter;
exports["default"] = _default;
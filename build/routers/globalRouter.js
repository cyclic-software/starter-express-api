"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _boardController = require("../controllers/boardController");
var _userController = require("../controllers/userController");
var _middlewares = require("../middlewares");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var globalRouter = _express["default"].Router();
globalRouter.get("/", _boardController.home);
globalRouter.route("/join").all(_middlewares.publicOnlyMiddleware).get(_userController.getJoin).post(_userController.postJoin);
globalRouter.route("/login").all(_middlewares.publicOnlyMiddleware).get(_userController.getLogin).post(_userController.postLogin);
globalRouter.get("/search", _boardController.search);
var _default = globalRouter;
exports["default"] = _default;
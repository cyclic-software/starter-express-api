"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _boardController = require("../controllers/boardController");
var _middlewares = require("../middlewares");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var boardRouter = _express["default"].Router();
boardRouter.route("/:id([0-9a-f]{24})").get(_boardController.getSeeBoard);
boardRouter.route("/:id([0-9a-f]{24})/edit").all(_middlewares.protectorMiddleware).get(_boardController.getEditBoard).post(_middlewares.boardImgFiles.single("boardImg"), _boardController.postEditBoard);
boardRouter.route("/:id([0-9a-f]{24})/delete").all(_middlewares.protectorMiddleware).get(_boardController.getDeleteBoard);
boardRouter.route("/write").all(_middlewares.protectorMiddleware).get(_boardController.getWriteBoard).post(_middlewares.boardImgFiles.single("boardImg"), _boardController.postWriteBoard);
var _default = boardRouter;
exports["default"] = _default;
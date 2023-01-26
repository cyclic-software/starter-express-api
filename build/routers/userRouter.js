"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _userController = require("../controllers/userController");
var _middlewares = require("../middlewares");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var userRouter = _express["default"].Router();
userRouter.route("/certifications").post(_userController.postCertification);
userRouter.route("/edit").all(_middlewares.protectorMiddleware).get(_userController.getEdit).post(_middlewares.avatarFiles.single("avatar"), _userController.postEdit);
userRouter.route("/check").get(_userController.getCheck).post(_userController.postCheck);
userRouter.route("/logout").all(_middlewares.protectorMiddleware).get(_userController.logout);
userRouter.route("/naverLogin").all(_middlewares.publicOnlyMiddleware).get(_userController.naverLogin);
userRouter.route("/callback").all(_middlewares.publicOnlyMiddleware).get(_userController.naverCallback);
userRouter.route("/change-password").all(_middlewares.protectorMiddleware).get(_userController.getChangePassword).post(_userController.postChangePassword);
userRouter.route("/delete").get(_userController.remove);
userRouter.route("/:id([0-9a-f]{24})").get(_userController.see);
var _default = userRouter;
exports["default"] = _default;
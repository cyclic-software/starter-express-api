"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _shopController = require("../controllers/shopController");
var _middlewares = require("../middlewares");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var shopRouter = _express["default"].Router();
shopRouter.route("/").all(_middlewares.protectorMiddleware).get(_shopController.getShopList).post(_middlewares.itemFiles.single("itemImg"), _shopController.postShopList);
shopRouter.route("/list").get(_shopController.getShopItem);
shopRouter.route("/list/:id([0-9a-f]{24})").get(_shopController.getShop);
shopRouter.route("/success").all(_middlewares.protectorMiddleware).get(_shopController.getShopSuccess).post(_shopController.postShop);
var _default = shopRouter;
exports["default"] = _default;
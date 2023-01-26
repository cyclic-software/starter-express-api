import express from "express";
import { getShop, getShopItem, getShopList, getShopSuccess, postShop, postShopList } from "../controllers/shopController";
import { itemFiles, protectorMiddleware } from "../middlewares";

const shopRouter = express.Router();

shopRouter
.route("/")
.all(protectorMiddleware)
.get(getShopList)
.post(itemFiles.single("itemImg"),postShopList)

shopRouter
.route("/list")
.get(getShopItem)

shopRouter
.route("/list/:id([0-9a-f]{24})")
.get(getShop)

shopRouter
.route("/success")
.all(protectorMiddleware)
.get(getShopSuccess)
.post(postShop)

export default shopRouter;
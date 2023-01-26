import express from "express";
import {
  getSeeBoard,
  getEditBoard,
  getDeleteBoard,
  getWriteBoard,
  postWriteBoard,
  postEditBoard,
} from "../controllers/boardController";
import { boardImgFiles, protectorMiddleware } from "../middlewares";
const boardRouter = express.Router();

boardRouter.route("/:id([0-9a-f]{24})").get(getSeeBoard);

boardRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEditBoard)
  .post(boardImgFiles.single("boardImg"), postEditBoard);

boardRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(getDeleteBoard);

boardRouter
  .route("/write")
  .all(protectorMiddleware)
  .get(getWriteBoard)
  .post(boardImgFiles.single("boardImg"), postWriteBoard);

export default boardRouter;

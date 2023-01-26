import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 30 },
  boardImg: { type: String, default: "image/cafe_logo.png" },
  content: { type: String, required: true, trim: true, maxLength: 300 },
  createdAt: { type: Date, required: true, default: Date.now },
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

const Board = mongoose.model("Board", boardSchema);
export default Board;

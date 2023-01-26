//Item을 꼭 지정 해줘야 할까?

import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, require: true },
  amount: { type: Number, require: true },
  itemImg: { type: String, default: "image/cafe_logo.png" },
  content: { type: String, required: true, trim: true, maxlength: 300 },
  createdAt : { type: Date, required: true, default: Date.now },
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  }
});

const Item = mongoose.model("Item", itemSchema);
export default Item;

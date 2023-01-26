import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  merchantUid: { type: String, require: true, default: "merchant_" + Date.now() },
  amount: { type: Number, require: true, default: 0 },
  cancelAmount: { type: Number, require: true, default: 0 },
  payMethod: { type: String, require: true, default: "card" },
  status: { type: String, default: "unpaid" },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    merchantUid: { type: String, require: true },
    impUid: { type: String, require: true },
    amount: { type: Number, require: true, default: 0 },
    cancelAmount: { type: Number, require: true, default: 0 },
    payMethod: { type: String, require: true, default: "card" },
    status: { type: String, default: "unpaid" },
  },
  { timestamps: true }
);


const Payment = mongoose.model("Order", paymentSchema);
export default Payment;

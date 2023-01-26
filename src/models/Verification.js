import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  code: { type: String, require: true },
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Verification = mongoose.model("Verification", verificationSchema);

export default Verification;

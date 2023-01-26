import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  avatar: String,
  username: { type: String, required: true, unique: true },
  socialOnly: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  phoneNum: { type: String, default: "" },
  password: { type: String },
  name: { type: String, required: true },
  region: { type: String, default: "korea" },
  verified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

const User = mongoose.model("User", userSchema);

export default User;

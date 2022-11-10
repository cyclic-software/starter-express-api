const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: { type: String, },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number }
}, {
    versionKey: false,
    timestamps: true
});

const User = mongoose.model("user", userSchema);

module.exports = User;
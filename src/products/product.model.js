const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, max: 100 },
    description: { type: String, },
    price: { type: Number, required: true }
}, {
    versionKey: false,
    timestamps: true
});

const product = mongoose.model("products", productSchema);

module.exports = product;
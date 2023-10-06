const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema utama (parent)
const strukProdukSchema = new Schema({
    name: String,
    harga: Number,
    jumlah: Number,
});

module.exports = mongoose.model('strukProduk', strukProdukSchema);
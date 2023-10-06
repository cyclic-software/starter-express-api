const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema utama (parent)
const strukPesananSchema = new Schema({
    produk : {
        name: String,
        harga: Number,
        jumlah: Number,
    },
    tglPesan: Date,
    reqTglPesan: Date,
    subtotal: Number,
    totalBayar: Number,
    diskon: Number,
    alamatPengiriman: String
});

module.exports = mongoose.model('StrukPesanan', strukPesananSchema);

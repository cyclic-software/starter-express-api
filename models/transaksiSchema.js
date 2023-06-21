const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema utama (parent)
const transaksiSchema = new Schema({
    jumlah: Number,
    totalHarga: Number,
    tawaranHarga: Number,
    tglPesan: Date,
    reqTglPesan: Date,
    alamatPengiriman: String,
    idProduk: [{
        type: Schema.Types.ObjectId,
        ref: 'Produk'
    }],
    idCustomer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
});

module.exports = mongoose.model('Transaksi', transaksiSchema);
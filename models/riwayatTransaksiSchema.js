const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema utama (parent)
const riwayatTransaksiSchema = new Schema({
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
    }
});

module.exports = mongoose.model('RiwayatTransaksi', riwayatTransaksiSchema);
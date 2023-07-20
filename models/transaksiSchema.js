const mongoose = require('mongoose');
const ProdukSchema = require('./produkSchema');
const { Schema } = mongoose;

const transaksiSchema = new Schema({
    tawaranHarga: { type: Number },
    tglPesan: { type: Date },
    reqTglPesan: { type: Date },
    alamatPengiriman: { type: String },
    idProduk: [
        {
            produk: {
                type: Schema.Types.ObjectId,
                ref: 'Produk'
            },
            jumlah: { type: Number, default: 1, min: 1 },
            deleted: { type: Boolean, default: false }
        }
    ],
    idCustomer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    totalBayar: { type: Number },
    deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Transaksi', transaksiSchema);

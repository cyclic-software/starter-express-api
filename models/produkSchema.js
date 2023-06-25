const mongoose = require('mongoose');
const { Schema } = mongoose;
const Bahan = require('./bahanSchema'); // Import schema Bahan
const { Admin } = require('./userSchema'); // Import schema Admin


// Schema utama (parent)
const produkSchema = new Schema({
    namaProduk: String,
    kategori: {
        type: String,
        enum: ['Roti', 'Snack', 'Nasi'],
        default: 'Roti'
    },
    stok: Number,
    jumlahTerjual: Number,
    jenisPemesanan: {
        type: String,
        enum: ['Ready', 'Pre-Order'],
        default: 'Ready'
    },
    bobotTenaga: Number,
    hargaProduk: Number,
    gambar: String,
    deskripsi: String,
    idBahan: [{
        type: Schema.Types.ObjectId,
        ref: 'Bahan'
    }],
    idAdmin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    },
    tglTambah: Date
});

module.exports = mongoose.model('Produk', produkSchema);    // Export model Produk
const mongoose = require('mongoose');
const { Schema } = mongoose;

const gambarSchema = new Schema({
    filename: {
        type: String,
        required: true
    },
    deskripsi: {
        type: String,
        required: true
    },
    nama: {
        type: String,   // Tambahkan field nama untuk setiap gambar
        required: true
    }
});

const iklanSchema = new Schema({
    gambar: [gambarSchema]  // Menggunakan sub-document gambarSchema untuk array gambar
});

module.exports = mongoose.model('Iklan', iklanSchema);

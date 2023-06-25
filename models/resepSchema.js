const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema utama (parent)
const resepSchema = new Schema({
    idProduk: {
        type: Schema.Types.ObjectId,
        ref: 'Produk',
        required: true
    },
    idBahan: {
        type: Schema.Types.ObjectId,
        ref: 'Bahan',
        required: true
    },
    jumlahPakai: {
        type: Number,
        required: true,
        min: 0
    },
    satuan: {
        type: String,
        required: true,
        enum: ['kg', 'gr', 'ons', 'ml', 'liter', 'pcs']
    }
});

module.exports = mongoose.model('Resep', resepSchema);

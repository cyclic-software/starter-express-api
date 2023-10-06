const mongoose = require('mongoose');
const { Schema } = mongoose;


// Schema utama (parent)
const historiUpdateProdukSchema = new Schema({
    tanggal: {
        type: Date,
        default: Date.now,
    },
    namaProduk: {
        type: String
    },
    stokSebelumnya: {
        type: Number,
        default: 0
    },
    stokSesudahnya: {
        type: Number
    }
});
module.exports = mongoose.model('HistoriUpdateProduk', historiUpdateProdukSchema);
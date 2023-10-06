const mongoose = require('mongoose');
const { Schema } = mongoose;
const moment = require('moment');

// Schema utama (parent)
const historiUpdateBahanSchema = new Schema({
    tanggal: {
        type: Date,
        default: Date.now,
    },
    namaBahan: {
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
module.exports = mongoose.model('HistoriUpdateBahan', historiUpdateBahanSchema);
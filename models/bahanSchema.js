const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema utama (parent)
const bahanSchema = new Schema({
    namaBahan: {
        type: String,
        required: true
    },
    stokBahan: {
        type: Number,
        required: true
    },
    satuan: {
        type: String,
        required: true,
        enum: ['kg', 'gr', 'ons', 'ml', 'liter', 'pcs']
    },
    expiredDate: {
        type: Date,
        required: true
    },
    resep: [{
        type: Schema.Types.ObjectId,
        ref: 'Resep'
    }]
});

module.exports = mongoose.model('Bahan', bahanSchema);
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Customer } = require('./userSchema'); // Import schema Customer
const Produk = require('./produkSchema'); // Import schema Produk

// Schema utama (parent)
const wishlistSchema = new Schema({
    idCustomer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    idProduk: {
        type: Schema.Types.ObjectId,
        ref: 'Produk'
    },
    jumlah: Number,
    tglTambah: Date
});

module.exports = mongoose.model('Wishlist', wishlistSchema);

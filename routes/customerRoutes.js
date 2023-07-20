const express = require('express');
const router = express.Router();
const produk = require('../controllers/produkController');
const transaksiController = require('../controllers/transaksiController');
const wishlistController = require('../controllers/wishlistController');

router.route('/index')
    .get(produk.index)

router.route('/transaksi')
    .post(transaksiController.createTransaksi);

router.route('/wishlist/:jenis')
    .get(wishlistController.index);

router.route('/wishlist/:id')
    .delete(wishlistController.deleteWishlist)
    .post(wishlistController.createWishlist);



module.exports = router;
const express = require('express');
const router = express.Router();
const produk = require('../controllers/produkController');
const transaksiController = require('../controllers/transaksiController');
const wishlistController = require('../controllers/wishlistController');
const { isLoggedIn, isCustomer } = require('../middleware');

router.route('/index')
    .get(isLoggedIn,produk.index)

router.route('/transaksi')
    .post(isLoggedIn,transaksiController.createTransaksi);

router.route('/wishlist/:jenis')
    .get(isLoggedIn, isCustomer,wishlistController.index);

router.route('/wishlist/:id')
    .delete(isLoggedIn, isCustomer,wishlistController.deleteWishlist)
    .post(isLoggedIn, isCustomer,wishlistController.createWishlist);

module.exports = router;
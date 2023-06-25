const express = require('express');
const router = express.Router();
const produk = require('../controllers/produkController');

router.route('/index')
    .get(produk.index)

module.exports = router;
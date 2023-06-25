const express = require('express');
const router = express.Router();
const produk = require('../controllers/produkController');
const bahan = require('../controllers/bahanController');

router.route('/produk')
    .get(produk.index)

router.route('/produk/new')
    .get(produk.renderNewForm)
    .post(produk.create);

router.route('/produk/edit/:id')
    .get(produk.renderEditForm)
    .patch(produk.update);

router.route('/produk/delete/:id')
    .delete(produk.delete);

router.route('/bahan')
    .get(bahan.index);

router.route('/bahan/new')
    .get(bahan.renderNewForm)
    .post(bahan.create);

router.route('/bahan/edit/:id')
    .get(bahan.renderEditForm)
    .patch(bahan.update);

router.route('/bahan/delete/:id')
    .delete(bahan.delete);

router.route('/produk/:id')
    .get(produk.show);

router.route('/produk/:id/resep/new')
    .post(produk.createResep);




router.route('/bahan/:id')
    .get(bahan.show);

module.exports = router;

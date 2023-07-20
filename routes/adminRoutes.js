const express = require('express');
const router = express.Router();
const produk = require('../controllers/produkController');
const bahan = require('../controllers/bahanController');
const transaksi = require('../controllers/transaksiController');


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

router.route('/:kategori')
    .get(transaksi.getTransaksi);

router.route('/moveTransaksiDalamProses/:idTransaksi/:idProduk/:jumlah')
    .post(transaksi.moveTransaksiDalamProses);

router.route('/moveTransaksiSelesai/:idTransaksi/:idProduk/:jumlah')
    .post(transaksi.moveTransaksiSelesai);

router.route('/deleteTransaksi/:idTransaksi/:idProduk/:jumlah')
    .delete(transaksi.deleteTransaksi);

router.route('/:kategori/RiwayatTransaksi')
    .get(transaksi.RiwayatTransaksi);

// router.route('/bobot')
//     .post(transaksi.createBobot);
router.route('/:aksi')
    .post(transaksi.updateBobot);

router.route('/dashboard/kasir')
    .get(produk.dashboard);



module.exports = router;

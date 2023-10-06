const Transaksi = require('../models/transaksiSchema');
const TransaksiDalamProses = require('../models/transaksiDalamProsesSchema');
const TransaksiSelesai = require('../models/riwayatTransaksiSchema');
const Produk = require('../models/produkSchema');
const Bobot = require('../models/bobotTenagaSchema');
const Resep = require('../models/resepSchema');
const Bahan = require('../models/bahanSchema');
const Wishlist = require('../models/wishlistSchema');
const moment = require('moment');
let nav = [], subnav = [];

class TransaksiController {

    static async createTransaksi(req, res) {
        const { tawaranHarga, tglPesan, reqTglPesan, alamatPengiriman, idProduk, jumlah, totalBayar } = req.body;
        var idCust = '';
        if (req.user.role == 'Customer') {
            idCust = req.user.id;
        } else if (req.user.role == 'Admin') {
            idCust = null;
        }else if (req.user.role == 'Kasir') {
            idCust = null;
        }
        // Membuat transaksi baru
        const transaksi = new Transaksi({
            tglPesan,
            reqTglPesan,
            alamatPengiriman,
            idProduk: [], // Inisialisasi idProduk sebagai array kosong
            idCustomer: idCust, // Anggap ada autentikasi dan mendapatkan ID pelanggan dari req.user.id
            totalBayar // Inisialisasi totalBayar dengan nilai 0
        });
        for (let i = 0; i < idProduk.length; i++) {
            const produkId = idProduk[i];
            const jumlahProduk = jumlah[i];
            await transaksi.idProduk.push({ produk: produkId, jumlah: jumlahProduk }); // Tambahkan produk ke array idProduk
        }
        await Wishlist.deleteMany({ idProduk: { $in: idProduk } }); // Hapus produk dari wishlist
        await transaksi.save();
        if (req.user.role == 'Customer') {
            res.redirect(`/customer/index`);
        } else if (req.user.role == 'Admin') {
            req.flash('success', 'Transaksi berhasil dibuat!');
            res.redirect(`/admin/dashboard/kasir`);
        }else if (req.user.role == 'Kasir') {
            req.flash('success', 'Transaksi berhasil dibuat!');
            res.redirect(`/kasir/dashboard`);
        }
    }

    static async moveTransaksiDalamProses(req, res) {
        const { idTransaksi, idProduk, jumlah } = req.params;
        const transaksi = await Transaksi.findById(idTransaksi);
        const cariTransaksiDalamProses = await TransaksiDalamProses.findById(idTransaksi);
        const tglKerja = moment(transaksi.reqTglPesan).format('YYYY-MM-DD');
        const bobot = await Bobot.findOne({ tglKerja: tglKerja });
        // const bobot = await Bobot.findOne({ tglKerja: transaksi.reqTglPesan });
        if (!bobot) {
            req.flash('error', 'Bobot tenaga kerja belum diatur!');
            res.redirect(`/admin/transaksiRoti`);
        } else {
            if (!cariTransaksiDalamProses) {
                const transaksiDalamProses = new TransaksiDalamProses({
                    _id: transaksi._id,
                    tawaranHarga: transaksi.tawaranHarga,
                    tglPesan: transaksi.tglPesan,
                    reqTglPesan: transaksi.reqTglPesan,
                    alamatPengiriman: transaksi.alamatPengiriman,
                    idProduk: [{ produk: idProduk, jumlah: jumlah }], // Masukkan idProduk beserta jumlah ke array idProduk
                    idCustomer: transaksi.idCustomer,
                    totalBayar: transaksi.totalBayar
                });

                const produk = await Produk.findById(idProduk);
                if (produk) {
                    // console.log(produk.idBahan[0]);
                    let stokBahanKurang = false;

                    for (let i = 0; i < produk.idBahan.length; i++) {
                        console.log(produk.idBahan[i]);
                        const resep = await Resep.findById(produk.idBahan[i]);
                        const bahan = await Bahan.findById(resep.idBahan);
                        console.log(bahan);
                        bahan.stokBahan -= (jumlah * resep.jumlahPakai);

                        if (bahan.stokBahan < 0 && !stokBahanKurang) {
                            req.flash('error', 'Stok Bahan Ada Yang Kurang, Harap Cek Gudang');
                            stokBahanKurang = true;
                        }

                        await bahan.save();
                    }
                    console.log(produk.stok);
                    produk.stok -= jumlah;
                    produk.jumlahTerjual += parseInt(jumlah);
                    console.log(produk.stok);
                    bobot.pointNow += (produk.bobotTenaga * jumlah);
                    if (bobot.pointNow > bobot.pointMax) {
                        req.flash('error', ' Bobot melebihi batas');
                    }
                    await bobot.save();
                    await produk.save();
                }

                await transaksiDalamProses.save();
            } else {
                const produk = await Produk.findById(idProduk);
                if (produk) {
                    // console.log(produk.idBahan[0]);
                    for (let i = 0; i < produk.idBahan.length; i++) {
                        const resep = await Resep.findById(produk.idBahan[i]);
                        const bahan = await Bahan.findById(resep.idBahan);
                        console.log(bahan);
                        bahan.stokBahan -= (jumlah * resep.jumlahPakai);
                        await bahan.save();
                    }
                    produk.stok -= jumlah;
                    produk.jumlahTerjual += parseInt(jumlah);
                    bobot.pointNow += produk.bobotTenaga;
                    if (bobot.pointNow > bobot.pointMax) {
                        req.flash('error', 'Point Melebihi Batas Maximal Tenaga');
                    }
                    await bobot.save();
                    await produk.save();
                }

                cariTransaksiDalamProses.idProduk.push({
                    produk: idProduk,
                    jumlah: jumlah
                });

                await cariTransaksiDalamProses.save();
            }

            await Transaksi.findByIdAndUpdate(idTransaksi, { $pull: { idProduk: { produk: idProduk } } });

            const updatedTransaksi = await Transaksi.findById(idTransaksi);
            if (!updatedTransaksi.idProduk || updatedTransaksi.idProduk.length === 0) {
                await Transaksi.deleteOne({ _id: idTransaksi });
            }

            res.redirect(`/admin/transaksiRoti`);
        }
    }

    static async moveTransaksiSelesai(req, res) {
        const { idTransaksi, idProduk, jumlah } = req.params;
        const transaksiDalamProses = await TransaksiDalamProses.findById(idTransaksi);
        const cariTransaksiSelesai = await TransaksiSelesai.findById(idTransaksi);
        const tglKerja = moment(transaksiDalamProses.reqTglPesan).format('YYYY-MM-DD');
        const bobot = await Bobot.findOne({ tglKerja: tglKerja });
        // const bobot = await Bobot.findOne({ tglKerja: transaksi.reqTglPesan });
        if (!bobot) {
            req.flash('error', 'Bobot tenaga kerja belum diatur!');
            res.redirect(`/admin/transaksiRoti`);
        } else {
            if (!cariTransaksiSelesai) {
                const transaksiSelesai = new TransaksiSelesai({
                    _id: transaksiDalamProses._id,
                    tawaranHarga: transaksiDalamProses.tawaranHarga,
                    tglPesan: transaksiDalamProses.tglPesan,
                    reqTglPesan: transaksiDalamProses.reqTglPesan,
                    alamatPengiriman: transaksiDalamProses.alamatPengiriman,
                    idProduk: [{ produk: idProduk, jumlah: jumlah }], // Masukkan idProduk beserta jumlah ke array idProduk
                    idCustomer: transaksiDalamProses.idCustomer,
                    totalBayar: transaksiDalamProses.totalBayar
                });
                const produk = await Produk.findById(idProduk);
                if (produk) {
                    bobot.pointNow -= produk.bobotTenaga;
                    await bobot.save();
                }
                await transaksiSelesai.save();
            } else {
                cariTransaksiSelesai.idProduk.push({
                    produk: idProduk,
                    jumlah: jumlah
                });
                const produk = await Produk.findById(idProduk);
                if (produk) {
                    bobot.pointNow -= produk.bobotTenaga;
                    await bobot.save();
                }
                await cariTransaksiSelesai.save();
            }

            await TransaksiDalamProses.findByIdAndUpdate(idTransaksi, { $pull: { idProduk: { produk: idProduk } } });

            const updatedTransaksi = await TransaksiDalamProses.findById(idTransaksi);
            if (!updatedTransaksi.idProduk || updatedTransaksi.idProduk.length === 0) {
                await TransaksiDalamProses.deleteOne({ _id: idTransaksi });
            }

            res.redirect(`/admin/transaksiRoti`);
        }
    }


    static async getTransaksi(req, res) {
        const url = req.path;
        const today = moment().startOf('day'); // Menggunakan moment untuk mendapatkan waktu saat ini
        const tgl = req.query.tglKerja; // Mengambil tanggal kerja dari query
        let tglKerja;
        if (!tgl) {
            tglKerja = moment(today).format('YYYY-MM-DD');
        } else {
            tglKerja = moment(tgl).format('YYYY-MM-DD');
        }


        const bobot = await Bobot.findOne({ tglKerja: tglKerja });
        // console.log(bobot.tglKerja);

        const transaksiSelesai = await TransaksiSelesai.find()
            .populate('idProduk.produk').populate('idCustomer').sort({ tglPesan: 'desc' }).exec();
        const transaksiDalamProses = await TransaksiDalamProses.find()
            .populate('idProduk.produk').populate('idCustomer').sort({ tglPesan: 'desc' }).exec();
        const transaksi = await Transaksi.find({ deleted: false })
            .populate('idProduk.produk').populate('idCustomer').sort({ tglPesan: 'desc' }).exec();
        let filter, inav, isubnav;

        if (url.includes('/transaksiRoti')) {
            filter = 'Roti';
            inav = 'Pemesanan AR (Roti)';
            isubnav = 'AR (Roti)';
        } else if (url.includes('/transaksiSnack')) {
            filter = 'Snack';
            inav = 'Pemesanan Jajan';
            isubnav = 'JN (Jajan & Nasi)';
        }
        // Mengubah format tanggal menjadi "YYYY-MM-DD"
        const formatDate = transaksi.map((t) => ({
            ...t.toObject(),
            tglPesan: moment(t.tglPesan).format('DD-MM-YYYY'),
            reqTglPesan: moment(t.reqTglPesan).format('DD-MM-YYYY'),
        }));
        const formatDateDalamProses = transaksiDalamProses.map((t) => ({
            ...t.toObject(),
            tglPesan: moment(t.tglPesan).format('DD-MM-YYYY'),
            reqTglPesan: moment(t.reqTglPesan).format('DD-MM-YYYY'),
        }));
        const formatDateSelesai = transaksiSelesai.map((t) => ({
            ...t.toObject(),
            tglPesan: moment(t.tglPesan).format('DD-MM-YYYY'),
            reqTglPesan: moment(t.reqTglPesan).format('DD-MM-YYYY'),
        }));
        let bobotDate = null;
        if (bobot) {
            bobotDate = {
                ...bobot.toObject(),
                tglKerja: moment(tglKerja).format('YYYY-MM-DD')
            };
        }
        console.log(bobotDate);

        res.render('admin/transaksi', { transaksi: formatDate, transaksiDalamProses: formatDateDalamProses, transaksiSelesai: formatDateSelesai, filter, bobot: bobotDate, tglKerja, moment, endPoint: 'produkSaya', nav: [inav], subnav: ['Pemesanan', isubnav] });
        // res.status(200).json({ transaksi: filteredTransaksi });
    }

    static async RiwayatTransaksi(req, res) {
        const bobot = await Bobot.findOne({});
        const transaksiSelesai = await TransaksiSelesai.find({})
            .populate('idProduk.produk').populate('idCustomer').sort({ tglPesan: 'asc' }).exec();
        const formatDateSelesai = transaksiSelesai.map((t) => ({
            ...t.toObject(),
            tglPesan: moment(t.tglPesan).format('DD-MM-YYYY'),
            reqTglPesan: moment(t.reqTglPesan).format('DD-MM-YYYY'),
        }));
        console.log(transaksiSelesai);
        res.render('admin/riwayatTransaksi', { transaksiSelesai: formatDateSelesai, bobot, endPoint: 'produkSaya', nav: ['Riwayat Pemesanan'], subnav: ['Pemesanan', 'Riwayat'] });
    }

    static async deleteTransaksi(req, res) {
        const { idTransaksi, idProduk, jumlah } = req.params;
        await Transaksi.updateOne(
            { _id: idTransaksi },
            { $set: { "idProduk.$[elem].deleted": true } },
            { arrayFilters: [{ "elem.produk": idProduk }] }
        );

        // await Transaksi.findByIdAndUpdate(idTransaksi, { $pull: { idProduk: { produk: idProduk } } });

        const updatedTransaksi = await Transaksi.findById(idTransaksi);
        const hasActiveIdProduk = updatedTransaksi.idProduk.some(idProduk => idProduk.deleted === false);

        if (!hasActiveIdProduk) {
            updatedTransaksi.deleted = true;
            await updatedTransaksi.save();
        }

        res.redirect(`/admin/transaksiRoti`);

        // Tambahkan method lain sesuai kebutuhan, seperti updateTransaksi, deleteTransaksi, getAllTransaksi, dll.
    }

    static async updateBobot(req, res) {
        const { aksi } = req.params;
        if (aksi === 'updateBobot') {
            console.log(req.body.tglKerja);
            const bobot = await Bobot.findOne({ tglKerja: req.body.tglKerja });
            console.log(bobot.tglKerja);
            bobot.pointMax = req.body.pointMax;
            await bobot.save();
            req.flash('success', 'Bobot berhasil diperbarui');
        } else if (aksi === 'resetPointNow') {
            const bobot = await Bobot.findOne({ tglKerja: req.body.tglKerja });
            bobot.pointNow = 0; // Reset pointNow menjadi 0
            await bobot.save();
            req.flash('success', 'Point Now berhasil direset');
        } else if (aksi === 'createBobot') {
            const newBobot = new Bobot({
                pointMax: req.body.pointMax,
                pointNow: 0,
                tglKerja: req.body.tglKerja
            });
            await newBobot.save();
        }
        res.redirect('/admin/transaksiRoti');
    }


}

module.exports = TransaksiController;

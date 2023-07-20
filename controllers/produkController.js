const Produk = require('../models/produkSchema');
const Bahan = require('../models/bahanSchema');
const Resep = require('../models/resepSchema');
const Wishlist = require('../models/wishlistSchema');
const moment = require('moment');
let nav = [], subnav = [];

class produkController {

    static async dashboard(req, res) {
        const produk = await Produk.find({ deleted: false });

        res.render('admin/dashboard', { produk, endPoint: 'produkSaya', nav: ['Dashboard'], subnav: ['Dashboard', 'Kasir'] });
    }
    static async index(req, res) {
        const url = req.path;
        let endPoint, view;

        if (url.includes('/produk')) {
            endPoint = 'produkSaya';
            view = 'admin/home';
        } else if (url.includes('/index')) {
            endPoint = 'produkUmum';
            view = 'customer/home';
        } else {
            return res.status(403).json({ message: 'Akses ditolak' });
        }

        const produk = await Produk.find({ deleted: false }); // Menampilkan hanya produk yang tidak dihapus

        // Mengubah format tanggal menggunakan moment.js
        const formattedProduk = produk.map(item => {
            return {
                ...item._doc,
                tglTambah: moment(item.tglTambah).format('DD/MM/YYYY')
            };
        });

        res.render(view, { endPoint, produk: formattedProduk, nav: ['Produk Saya'], subnav: ['Produk', 'Produk Saya'] });
    }

    static async getHistory(req, res) {
        const { id } = req.params;
        const produk = await Produk.findById(id);
        const historiUpdate = produk.historiUpdate.map(item => {
            return {
                ...item._doc,
                tanggal: moment(item.tanggal).format('DD/MM/YYYY')
            };
        });
        res.render('admin/history', { produk, historiUpdate });
    }


    static async renderNewForm(req, res) {
        res.render('admin/formAddProduk', { endPoint: 'produkSaya', nav: ['Tambah Produk'], subnav: ['Produk', 'Tambah Produk'] });
    }

    static async renderEditForm(req, res) {
        const productId = req.params.id;
        // Lakukan pengambilan data produk dari database berdasarkan productId
        const produk = await Produk.findById(productId);
        res.render('admin/formEditProduk', { produk, nav: ['Edit Produk'], subnav: ['Produk', 'Edit Produk'] });
    }

    static async create(req, res) {
        const produk = new Produk(req.body.produk);
        produk.idAdmin = req.user._id;
        // produk.idAdmin = '648e7d0b365741a7cee9b6af';
        produk.tglTambah = Date.now();
        await produk.save();
        req.flash('success', 'Successfully made a new produk!');
        res.redirect(`/admin/produk`);
    }

    static async update(req, res) {
        const { id } = req.params;
        const updatedData = req.body.produk;
        const product = await Produk.findById(id);
        // Simpan stok sebelumnya
        const stokSebelumnya = product.stok;
        // Update data produk
        const updatedProduct = await Produk.findByIdAndUpdate(id, updatedData, { new: true });
        // Simpan stok sesudahnya
        const stokSesudahnya = updatedProduct.stok;
        // Tambahkan entri baru ke historiUpdate
        updatedProduct.historiUpdate.push({
            tanggal: Date.now(),
            stokSebelumnya,
            stokSesudahnya
        });
        // Simpan perubahan produk
        await updatedProduct.save();
        req.flash('success', 'Successfully updated produk!');
        res.redirect(`/admin/produk`);
    }



    static async show(req, res) {
        try {
            const { id } = req.params;
            const produk = await Produk.findById(id);
            const bahan = await Bahan.find({});
            const resep = await Resep.find({ idProduk: id }).populate('idBahan').lean();

            res.render('admin/showProduk', { produk, bahan, resep, nav: ['Rincian Produk & Resep'], subnav: ['Produk', 'Rincian Produk & Resep'] });
        } catch (error) {
            console.error(error);
            // Handle error response
        }
    }



    static async delete(req, res) {
        const { id } = req.params;
        const product = await Produk.findByIdAndUpdate(id, {
            deleted: true,
            deletedAt: Date.now()
        }, { new: true });
        // Menghapus data produk dari wishlist
        await Wishlist.deleteMany({ idProduk: id });
        req.flash('success', 'Successfully deleted produk');
        res.redirect(`/admin/produk`);
    }

    static async createResep(req, res) {
        const { resep } = req.body;
        const produkId = req.params.id;

        try {
            const produk = await Produk.findById(produkId);

            // Membuat array objek resep baru dari data yang dikirimkan
            const newResep = resep.map(item => new Resep({
                idProduk: produkId,
                idBahan: item.idBahan,
                jumlahPakai: item.jumlahPakai,
                satuan: item.satuan
            }));
            console.log(newResep);

            // Menambahkan semua resep baru ke array idBahan pada produk
            produk.idBahan.push(...newResep);

            // Menyimpan perubahan pada produk
            await produk.save();
            await Resep.insertMany(newResep);

            req.flash('success', 'Successfully added new resep!');
            res.redirect(`/admin/produk/${produkId}`);
        } catch (error) {
            req.flash('error', 'Failed to add new resep!');
            res.redirect(`/admin/produk/${produkId}`);
        }
    }

}

module.exports = produkController;
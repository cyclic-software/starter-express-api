const Produk = require('../models/produkSchema');
const Bahan = require('../models/bahanSchema');
const Resep = require('../models/resepSchema');

class produkController {
    static async index(req, res) {
        const url = req.path; // Mendapatkan jalur URL dari objek req
        console.log(url)
        let endPoint, view;

        if (url.includes('/produk')) {
            endPoint = 'produkSaya';
            view = 'admin/home';
        } else if (url.includes('/index')) {
            res.send('customer page');
            // endPoint = 'produkUmum';
            // view = 'customer/home'; // Ganti 'customer/home' dengan template yang sesuai untuk tampilan pelanggan
        } else {
            // Jika URL tidak sesuai dengan endpoint yang ditentukan, tangani dengan cara yang sesuai
            return res.status(403).json({ message: 'Akses ditolak' });
        }

        const produk = await Produk.find({});
        res.render(view, { endPoint, produk });
    }


    static async renderNewForm(req, res) {
        res.render('admin/formAddProduk', { endPoint: 'produkSaya' });
    }

    static async renderEditForm(req, res) {
        const productId = req.params.id;
        // Lakukan pengambilan data produk dari database berdasarkan productId
        const produk = await Produk.findById(productId);
        res.render('admin/formEditProduk', { produk });
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
        const updatedProduct = await Produk.findByIdAndUpdate(id, updatedData, { new: true });
        req.flash('success', 'Successfully updated produk!');
        res.redirect(`/admin/produk`);
    }

    static async show(req, res) {
        const { id } = req.params;
        const produk = await Produk.findById(id);
        const bahan = await Bahan.find({});
        res.render('admin/showProduk', { produk, bahan });
    }

    static async delete(req, res) {
        const { id } = req.params;
        await Produk.findByIdAndDelete(id);
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
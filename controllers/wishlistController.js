const Wishlist = require('../models/wishlistSchema');
const Produk = require('../models/produkSchema');
const moment = require('moment');

class WishlistController {

    static async index(req, res) {
        const idCustomer = req.user.id;
        const jenis = req.params.jenis;
        const wishlist = await Wishlist.find({ idCustomer: idCustomer }).populate('idProduk').populate('idCustomer');

        // Mengubah format tanggal menjadi "YYYY-MM-DD"
        const wishlistFormatted = wishlist.map((w) => ({
            ...w.toObject(),
            tglTambah: moment(w.tglTambah).format('DD-MM-YYYY'),
        }));

        // Filter wishlist berdasarkan kategori "Roti"
        const rotiWishlist = wishlistFormatted.filter((w) => w.idProduk.kategori === jenis);

        res.render('customer/wishlist', { wishlist: rotiWishlist });
    }

    static async createWishlist(req, res) {
        const { id } = req.params;
        const { id: customerId } = req.user;

        try {
            let wishlist = await Wishlist.findOne({ idProduk: id, idCustomer: customerId });

            if (wishlist) {
                // Jika produk sudah ada di wishlist, tambahkan jumlahnya
                wishlist.jumlah++;
                await wishlist.save();
            } else {
                // Jika produk belum ada di wishlist, buat wishlist baru
                wishlist = new Wishlist({
                    idProduk: id,
                    idCustomer: customerId,
                    tglTambah: Date.now(),
                    jumlah: 1
                });
                await wishlist.save();
            }

            req.flash('success', 'Successfully added to wishlist!');
            const produk = await Produk.findById(id);

            if (produk.kategori === 'Roti') {
                res.redirect('/customer/wishlist/Roti');
            } else if (produk.kategori === 'Snack') {
                res.redirect('/customer/wishlist/Snack');
            } else {
                res.redirect('/customer/wishlist');
            }
        } catch (error) {
            console.error(error);
            req.flash('error', 'An error occurred while adding to wishlist.');
            res.redirect('/customer/wishlist');
        }
    }

    // static async createWishlist(req, res) {
    //     const { id } = req.params;
    //     const wishlist = new Wishlist();
    //     wishlist.idProduk = id;
    //     wishlist.idCustomer = req.user.id;
    //     wishlist.tglTambah = Date.now();
    //     await wishlist.save();
    //     console.log(wishlist);
    //     // res.send(wishlist);
    //     req.flash('success', 'Successfully made a new wishlist!');
    //     const produk = await Produk.findById(id);
    //     if (produk.kategori === 'Roti') res.redirect(`/customer/wishlist/Roti`);
    //     else if (produk.kategori === 'Snack') res.redirect(`/customer/wishlist/Snack`);
    // }

    static async deleteWishlist(req, res) {
        const { id } = req.params;
        await Wishlist.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted wishlist!');
        // res.redirect(`/admin/wishlist`);
    }
}

module.exports = WishlistController;

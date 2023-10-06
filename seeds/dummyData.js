// const express = require('express');
// const mongoose = require('mongoose');

// const app = express();

// // Koneksi ke database MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/Bakery', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// // Definisikan model dan schema yang diperlukan
// const Transaksi = require('../models/transaksiSchema');

// // Jalankan query agregasi untuk mendapatkan jumlah data
// // const adminId = '648db1c79b98fa05556c36e3';

// Transaksi.find()
//     .then((result) => {
//         console.log(result);
//     })
//     .catch((error) => {
//         console.error(error);
//     });

// // Port server
// const port = 3000;

// // Pastikan Anda sudah terhubung ke database MongoDB dengan cara yang benar
// mongoose.connection.once('open', () => {
//     console.log('Terhubung ke database MongoDB');
//     // Jalankan server
//     app.listen(port, () => {
//         console.log(`Server berjalan di http://localhost:${port}`);
//     });
// })
//     .on('error', (error) => {
//         console.error('Gagal terhubung ke database MongoDB:', error);
//     });

const mongoose = require('mongoose');
const Bahan = require('../models/bahanSchema');
const { Admin, Customer } = require('../models/userSchema');
const Produk = require('../models/produkSchema');
const Wishlist = require('../models/wishlistSchema');
const Bobot = require('../models/bobotTenagaSchema');
const RiwayatTransaksi = require('../models/riwayatTransaksiSchema');
const Transaksi = require('../models/transaksiSchema');
const TransaksiDalamProses = require('../models/transaksiDalamProsesSchema');

// Fungsi untuk menambahkan data dummy
const createDummyData = async () => {
    try {
        // Tambahkan data dummy Bahan
        const bahan = await Bahan.create({ namaBahan: 'Bahan Dummy', stokBahan: 10, expiredDate: new Date() });
        // Tambahkan data dummy Admin
        const admin = await Admin.create({ username: 'admin1', email: 'admin1@example.com', nama: 'Admin Dummy', alamat: 'Alamat Admin', nomorTelepon: '123456789' });
        // Tambahkan data dummy Produk
        const produk = await Produk.create({ namaProduk: 'Produk Dummy Azziz', idAdmin: admin._id, idBahan: [bahan._id], tglTambah: new Date(), jenisPemesanan: 'Order' });
        // Tambahkan data dummy Customer
        const customer = await Customer.create({ username: 'Azziz', email: 'customer1@example.com', nama: 'Customer Dummy', alamat: 'Alamat Customer', nomorTelepon: '987654321' });
        // Tambahkan data dummy Wishlist
        const wishlist = await Wishlist.create({ idCustomer: customer._id, idProduk: [produk._id], tglTambah: new Date() });
        // Tambahkan data dummy Bobot
        const bobot = await Bobot.create({ point: 10 });
        // Tambahkan data dummy RiwayatTransaksi
        const riwayatTransaksi = await RiwayatTransaksi.create({ jumlah: 2, totalHarga: 100, idProduk: [produk._id], idCustomer: customer._id, tglTransaksi: new Date() });

        // Tambahkan data dummy Transaksi
        const transaksi = await Transaksi.create({ jumlah: 2, totalHarga: 100, idProduk: [produk._id] });

        // Tambahkan data dummy TransaksiDalamProses
        const transaksiDalamProses = await TransaksiDalamProses.create({ jumlah: 2, totalHarga: 100, idProduk: [produk._id], totalBobot: 4 });

        console.log('Data dummy berhasil ditambahkan!');
    } catch (error) {
        console.error('Gagal menambahkan data dummy:', error);
    }
};

// Pastikan Anda sudah terhubung ke database MongoDB dengan cara yang benar
mongoose
    .connect('mongodb://127.0.0.1:27017/Bakery', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Terhubung ke database MongoDB');
        createDummyData(); // Panggil fungsi untuk menambahkan data dummy setelah terhubung ke database
    })
    .catch((error) => console.error('Gagal terhubung ke database MongoDB:', error));

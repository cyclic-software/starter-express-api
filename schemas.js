// const Joi = require('joi');
// // bahan schema validation
// module.exports.bahanSchema = Joi.object({
//     namaBahan: Joi.string().required(),
//     stokBahan: Joi.number().required().min(0),
//     expiredDate: Joi.date().required()
// });

// module.exports.bobotSchemaValidation = Joi.object({
//     point: Joi.number().required().min(0)
// });

// module.exports.produkSchemaValidation = Joi.object({
//     namaProduk: Joi.string().required(),
//     kategori: Joi.string().valid('Roti', 'Nasi').default('Roti'),
//     harga: Joi.number().required().min(0),
//     stok: Joi.number().required().min(0),
//     jumlahTerjual: Joi.number().required().min(0),
//     jenisPemesanan: Joi.string().valid('Order', 'Pre-Order').default('Order'),
//     bobotTenaga: Joi.number().required().min(0),
//     hargaProduk: Joi.number().required().min(0),
//     gambar: Joi.string().required(),
//     deskripsi: Joi.string().required(),
//     idBahan: Joi.array().items(Joi.string().required()), // Validasi array of strings
//     idAdmin: Joi.string().required(), // Validasi string
//     tglTambah: Joi.date().required()
// });

// module.exports.transaksiValidationSchema = Joi.object({
//     jumlah: Joi.number().required(),
//     totalHarga: Joi.number().required(),
//     tawaranHarga: Joi.number(),
//     tglPesan: Joi.date().required(),
//     reqTglPesan: Joi.date(),
//     alamatPengiriman: Joi.string().required(),
//     idProduk: Joi.array().items(Joi.string().objectId()),
//     idCustomer: Joi.string().objectId().required(),
// });

// module.exports.transaksiDalamProsesValidationSchema = Joi.object({
//     jumlah: Joi.number().required(),
//     totalHarga: Joi.number().required(),
//     tawaranHarga: Joi.number(),
//     tglPesan: Joi.date().required(),
//     reqTglPesan: Joi.date(),
//     alamatPengiriman: Joi.string().required(),
//     totalBobot: Joi.number().required(),
//     idProduk: Joi.array().items(Joi.string().objectId()),
//     idCustomer: Joi.string().objectId().required(),
// });

// module.exports.transaksiSelesaiValidationSchema = Joi.object({
//     jumlah: Joi.number().required(),
//     totalHarga: Joi.number().required(),
//     tawaranHarga: Joi.number(),
//     tglPesan: Joi.date().required(),
//     reqTglPesan: Joi.date(),
//     alamatPengiriman: Joi.string().required(),
//     totalBobot: Joi.number().required(),
//     idProduk: Joi.array().items(Joi.string().objectId()),
//     idCustomer: Joi.string().objectId().required(),
// });

// module.exports.userSchemaValidation = Joi.object({
//     username: Joi.string().required(),
//     email: Joi.string().email().required(),
//     nama: Joi.string().required(),
//     alamat: Joi.string().required(),
//     nomorTelepon: Joi.string().required(),
//     password: Joi.string().required().min(6) // Minimal 6 karakter
// });

// module.exports.adminSchemaValidation = Joi.object({
//     role: Joi.string().required().valid('Admin').default('Admin')
// });

// module.exports.customerSchemaValidation = Joi.object({
//     role: Joi.string().required().valid('Customer').default('Customer')
// });

// module.exports.wishlistSchemaValidation = Joi.object({
//     idCustomer: Joi.string().objectId().required(),
//     idProduk: Joi.array().items(Joi.string().objectId()),
//     tglTambah: Joi.date().required()
// });

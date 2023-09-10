const Produk = require('../models/produkSchema');
const Bahan = require('../models/bahanSchema');
const Struk = require('../models/strukPesananSchema');
const StrukProduk = require('../models/strukProdukSchema');
const Iklan = require('../models/iklanSchema');

class KasirController {
    static async dashboard(req, res) {
      const kategori = req.query.kategori;
      var produk=null;
      if  (kategori) {
        produk = await Produk.find({ kategori, deleted: false });
      } else {
        produk = await Produk.find({ deleted: false });
      }
        res.render('kasir/dashboard', { produk, endPoint: 'kasirSaya', nav: ['Kasir'], subnav: ['Kasir', 'Kasir'] });
    }

    static async customer(req, res) {
        try {
          // const { tglPesan } = await Struk.findOne({}) || { total: 0 };
          const iklan = await Iklan.findOne({});
          res.render('kasir/customer', {iklan});
        } catch (error) {
          console.error('Terjadi kesalahan:', error);
        }
      }

      static async iklan(req, res) {
        res.render('kasir/addIklan', { endPoint: 'kasirSaya', nav: ['Iklan'], subnav: ['Iklan', 'Iklan'] })
      }

      static async createIklan(req, res) {
        try {
            const existingIklan = await Iklan.findOne(); // Cek apakah data iklan sudah ada
            
            const gambarArray = [];
            for (let i = 1; i <= 3; i++) {
                const file = req.files[`gambar${i}`][0];
                const nama = req.body[`nama${i}`]; // Ambil data nama gambar dari form
                const deskripsi = req.body[`deskripsi${i}`];
    
                gambarArray.push({
                    filename: file.filename,
                    nama: nama,    // Simpan data nama dalam array gambar
                    deskripsi: deskripsi
                });
            }
            const iklanData = {
                gambar: gambarArray
            };
    
            if (existingIklan) {
                // Jika data iklan sudah ada, update array gambar
                existingIklan.gambar = gambarArray;
                await existingIklan.save();
            } else {
                // Jika data iklan belum ada, buat data baru
                const newIklan = new Iklan(iklanData);
                await newIklan.save();
            }
    
            res.redirect('/kasir/iklan');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
    

      static async strukTransaksi(req, res){
        try {
          // console.log('masuk');
          const struk = await Struk.findOne({}) || { total: 0 };
          const strukProduk = await StrukProduk.find({});
          res.json({ struk, strukProduk });
          // console.log(struk);
          // console.log(strukProduk);
        } catch (error) {
          console.error('Terjadi kesalahan:', error);
        }
      }
}

module.exports = KasirController;
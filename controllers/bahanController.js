const Bahan = require('../models/bahanSchema');
const Resep = require('../models/resepSchema');
const HistoryBahan = require('../models/historiUpdateBahan');
const moment = require('moment');
let nav = [], subnav = [];

class bahanController {
    static async index(req, res) {
        const bahan = await Bahan.find({});
        
        const bahanFormatted = bahan.map((b) => ({
            ...b.toObject(),
            expiredDate: moment(b.expiredDate).format('DD-MM-YYYY'),
        }));
        res.render('admin/bahan', { bahan: bahanFormatted, endPoint: 'produkSaya', nav: ['Gudang Saya'], subnav: ['Bahan', 'Bahan Saya'] });
    }

    static async renderNewForm(req, res) {
        res.render('admin/formAddBahan');
    }

    static async renderEditForm(req, res) {
        const bahanId = req.params.id;
        const bahan = await Bahan.findById(bahanId);
        res.render('admin/formEditBahan', { bahan, endPoint: 'produkSaya' });
    }

    static async create(req, res) {
        const bahan = new Bahan(req.body.bahan);
        await bahan.save();
        req.flash('success', 'Successfully made a new bahan!');
        res.redirect(`/admin/bahan`);
    }

    static async update(req, res) {
        const { id } = req.params;
        const updatedData = req.body.bahan;
        const bahan = await Bahan.findById(id);
        const history = new History({
            namaBahan: bahan.namaBahan,
            stokSebelumnya: bahan.stokBahan,
            stokSesudahnya: updatedData.stokBahan,
        });
        history.save();
        const updateBahan = await Bahan.findByIdAndUpdate(id, updatedData);
        res.redirect(`/admin/bahan`);
    }

    static async delete(req, res) {
        const { id } = req.params;
        await Bahan.findByIdAndDelete(id);
        await Resep.deleteMany({ idBahan: id }); // Delete associated Resep records
        req.flash('success', 'Successfully deleted bahan and its associated resep');
        res.redirect('/admin/bahan');
    }

    // static async show(req, res) {
    //     const { id } = req.params;
    //     const bahan = await Bahan.findById(id);
    //     res.render('admin/showBahan', { bahan });
    // }

    static async getHistoryBahan(req, res) {
        const history = await HistoryBahan.find({}).sort({ tanggal: -1 }).lean();
        // Mengubah format tanggal menggunakan moment.js
        const formattedHistory = history.map(item => {
            return {
                ...item,
                tanggal: moment(item.tanggal).format('DD/MM/YYYY')
            };
        });
        console.log(formattedHistory);
        res.render('admin/HistoryBahan', { endPoint: 'produkSaya', history: formattedHistory, nav: ['History'], subnav: ['Bahan', 'History'] });
    }
    
    
    static async deleteHistoryBahan(req, res) {
        const { id } = req.params;
        const history = await HistoryBahan.findByIdAndDelete(id);
        if (!history) {
            req.flash('error', 'History entry not found');
            return res.redirect('/admin/histori/bahan');
        }
        req.flash('success', 'Successfully deleted bahan history');
        res.redirect('/admin/histori/bahan');
    }
}


module.exports = bahanController;
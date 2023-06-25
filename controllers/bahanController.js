const Bahan = require('../models/bahanSchema');
const moment = require('moment');

class bahanController {
    static async index(req, res) {
        const bahan = await Bahan.find({});

        // Mengubah format tanggal menjadi "YYYY-MM-DD"
        const bahanFormatted = bahan.map((b) => ({
            ...b.toObject(),
            expiredDate: moment(b.expiredDate).format('DD-MM-YYYY'),
        }));

        res.render('admin/bahan', { bahan: bahanFormatted });
    }


    static async renderNewForm(req, res) {
        res.render('admin/formAddBahan');
    }

    static async renderEditForm(req, res) {
        const bahanId = req.params.id;
        const bahan = await Bahan.findById(bahanId);
        res.render('admin/formEditBahan', { bahan });
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
        const updateBahan = await Bahan.findByIdAndUpdate(id, updatedData);
        res.redirect(`/admin/bahan`);
    }

    static async delete(req, res) {
        const { id } = req.params;
        await Bahan.findByIdAndDelete(id);
        req.flash('success', 'Successfully deleted bahan');
        res.redirect(`/admin/bahan`);
    }

    static async show(req, res) {
        const { id } = req.params;
        const bahan = await Bahan.findById(id);
        res.render('admin/showBahan', { bahan });
    }
}

module.exports = bahanController;
const History = require('../models/historiUpdateProduk');
const HistoryBahan = require('../models/historiUpdateBahan');

let nav = [], subnav = [];

class historyController {
    static async index(req, res) {
        const history = await History.find({}).sort({ tanggal: -1 });
        console.log(history);
        res.render('admin/history', { history, nav: ['History'], subnav: ['History'] });
    }
}

module.exports = historyController;
const express = require('express');
const router = express.Router();
const kasir = require('../controllers/kasirController');
const { isLoggedIn, isKasir } = require('../middleware');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set the destination folder for uploaded images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Set the filename of the uploaded image
    }
});
const upload = multer({ storage: storage });

router.route('/dashboard')
    .get(isLoggedIn, isKasir,kasir.dashboard)
    // .get(kasir.dashboard)

router.route('/iklan')
router.route('/iklan')
    .get(isLoggedIn, isKasir,kasir.iklan)
    .post(upload.fields([
        { name: 'gambar1', maxCount: 1 },
        { name: 'gambar2', maxCount: 1 },
        { name: 'gambar3', maxCount: 1 }
    ]), kasir.createIklan);

    router.route('/customer')
    .get(kasir.customer)

    router.route('/api/strukTransaksi')
    .get(kasir.strukTransaksi)

    
module.exports = router;
    
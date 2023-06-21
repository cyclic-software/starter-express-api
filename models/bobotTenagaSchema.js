const mongoose = require('mongoose');
const { Schema } = mongoose;

// Schema utama (parent)
const bobotSchema = new Schema({
    point: Number
});

module.exports = mongoose.model('Bobot', bobotSchema);
const mongoose = require("mongoose");
const connect = () => mongoose.connect('mongodb+srv://gir:1@cluster0.tgipopf.mongodb.net/?retryWrites=true&w=majority/assn');
module.exports = connect;
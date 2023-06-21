const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

// Schema utama (parent)
const userSchema = new Schema({
    username: String,
    email: String,
    nama: String,
    alamat: String,
    nomorTelepon: String
});

// Schema admin (child)
const adminSchema = new Schema({
    role: {
        required: true,
        type: String,
        default: 'Admin'
    }
});

// Schema customer (child)
const customerSchema = new Schema({
    role: {
        required: true,
        type: String,
        default: 'Customer'
    }
});

userSchema.plugin(passportLocalMongoose);
// Model user
const User = mongoose.model('User', userSchema);
// Model admin (mewarisi User)
const Admin = User.discriminator('Admin', adminSchema);
// Model customer (mewarisi User)
const Customer = User.discriminator('Customer', customerSchema);


module.exports = { User, Admin, Customer };

const { Admin, Customer, User, Kasir } = require('../models/userSchema');
const passport = require('passport');

class userController {

    static renderHome(req, res) {
        res.redirect("/login");
    }
    static renderRegister(req, res) {
        res.render('user/register', { endPoint: 'none' });
    }

    static async register(req, res, next) {
        try {
            const { username, email, nama, alamat, nomorTelepon, password, role } = req.body;
    
            let user;
            if (role === 'Admin') {
                user = new Admin({ username, email, nama, alamat, nomorTelepon });
            } else if (role === 'Customer') {
                user = new Customer({ username, email, nama, alamat, nomorTelepon });
            } else if (role === 'Kasir') {
                user = new Kasir({ username, email, nama, alamat, nomorTelepon });
            }
    
            const registeredUser = await User.register(user, password);
            req.flash('success', 'Successfully registered');
            if(role === 'Admin' || role === 'Kasir') {
            res.redirect('/admin/kasir'); 
            }
            else if(role === 'Customer') {
                res.redirect('/admin/kasir');
            }
        } catch (e) {
            console.log(e.message);
            req.flash('error', e.message);
            res.redirect('/register');
        }
    }


    static renderLogin(req, res) {
        res.render('user/login', { endPoint: 'none' });
    }

    static login(req, res) {
        req.flash('success', 'Logging Successed!');
    
        if (req.user.role === 'Admin') {
            return res.redirect('/admin/produk');
        } else if (req.user.role === 'Customer') {
            return res.redirect('/customer/index');
        } else if (req.user.role === 'Kasir') {
            return res.redirect('/kasir/dashboard');
        }
    
        // If the user's role is not matched with any of the conditions above,
        // it will redirect to the default URL (stored in req.session.returnTo).
        const redirectUrl = req.session.returnTo;
        delete req.session.returnTo;
        console.log(redirectUrl);
        return res.redirect(redirectUrl);
    }
    

    static logout(req, res) {
        req.logout(function(err) {
            if (err) {
                // Handle any error that might occur during logout
                console.error(err);
            }
            req.flash('success', 'Goodbye!');
            res.redirect('/login');
        });
    }

    static async getAddKasir(req, res) {
        const user = await User.find({role: 'Kasir'});
        const admin = await User.find({role: 'Admin'});
        res.render('admin/registerKasir', {user, admin, endPoint: 'produkSaya', nav: ['Tambah Kasir'], subnav: ['Kasir', 'Tambah Kasir'] });
    }

    static async deleteKasir(req, res) {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/admin/kasir');
        }
        req.flash('success', 'Successfully deleted user');
        res.redirect('/admin/kasir');
    }
}

module.exports = userController;
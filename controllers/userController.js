const { Admin, Customer, User } = require('../models/userSchema');

class userController {
    static renderRegister(req, res) {
        res.render('user/register', { endPoint: 'none' });
    }

    static async register(req, res, next) {
        try {
            const { username, email, nama, alamat, nomorTelepon, password, role } = req.body;

            let user;
            if (role === 'Admin') {
                user = new Admin({ username, email, nama, alamat, nomorTelepon });
            } else {
                user = new Customer({ username, email, nama, alamat, nomorTelepon });
            }

            const registeredUser = await User.register(user, password);

            req.login(registeredUser, err => {
                if (err) return next(err);
                console.log('Admin successfully registered');
                req.flash('success', 'Welcome to Bakery');
                res.redirect('/login');
            });
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
        req.flash('success', 'Loggin Successed!');
        if (req.user.role === 'Admin') {
            res.redirect('/admin/produk');
        }
        else {
            res.redirect('/customer/index');
        }
        // const redirectUrl = req.session.returnTo;
        // delete req.session.returnTo;
        // console.log(redirectUrl)
        // res.redirect(redirectUrl);
    }

    static logout(req, res) {
        req.logout();
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    }
}

module.exports = userController;
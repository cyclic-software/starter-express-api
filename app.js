const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// import
const { ExpressError } = require('./utils/ExpressError');
//try catch async
const catchAsync = require('./utils/catchAsync');
global.catchAsync = catchAsync.asyncWrapper;
// import models
const { User } = require('./models/userSchema');
// routes
const userRoutes = require('./routes/userRoutes');
const adminRotues = require('./routes/adminRoutes');
const customerRoutes = require('./routes/customerRoutes');

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

mongoose.connect('mongodb://127.0.0.1:27017/Bakery', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Mongo Connection Open');
    })
    .catch(err => {
        console.log('Mongo Connection Error');
        console.log(err);
    });
// 
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
// passport auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy('local', User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to pass flash message to all template
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Routes
app.use('/', userRoutes);
app.use('/admin', adminRotues);
app.use('/customer', customerRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

const { campgroundSchema, reviewSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError')
// const Campground = require('./models/campground')
// const Review = require('./models/review')


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isKasir = (req, res, next) => {
    if (req.user.role !== 'Kasir') {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/kasir/dashboard');
    }
    next();
}

    module.exports.isCustomer = (req, res, next) => {
        if (req.user.role !== 'Customer') {
            req.flash('error', 'You do not have permission to do that!');
            console.log(req.user.role);
            return res.redirect('/customer/index');
        }
        next();
    }
        module.exports.isAdmin = (req, res, next) => {
            if (req.user.role !== 'Admin') {
                req.flash('error', 'You do not have permission to do that!');
                return res.redirect('/admin/produk');
            }
            next();
    }

//middleware to validate campground
// module.exports.validateCampground = (req, res, next) => {
//     // console.log(req.body);
//     const { error } = campgroundSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// }

// module.exports.isAuthor = async (req, res, next) => {
//     const { id } = req.params;
//     const camp = await Campground.findById(id);
//     if (!camp.author.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/campgrounds/campgroundDetail/${id}`);
//     }
//     next();
// }


// module.exports.validateReview = (req, res, next) => {
//     // console.log(req.body);
//     const { error } = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// }

// module.exports.isAuthorReview = async (req, res, next) => {
//     const { id, reviewId } = req.params;
//     const foundReview = await review.findById(reviewId);
//     if (!foundReview.author.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/campgrounds/campgroundDetail/${id}`);
//     }
//     next();
// }
// module.exports.isReviewAuthor = async (req, res, next) => {
//     const { id, reviewId } = req.params;
//     const review = await Review.findById(reviewId);
//     if (!review.author.equals(req.user._id)) {
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect(`/campgrounds/campgroundDetail/${id}`);
//     }
//     next();
// };


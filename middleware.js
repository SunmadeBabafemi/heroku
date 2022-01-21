const ExpressError = require('./utilities/ExpressError')
const {campgroundSchema, reviewSchema} = require('./schema')
const Campground = require('./models/campground');
const Review = require('./models/review')


module.exports.isLoggedIn = (req, res, next) =>  {
    console.log('Req.User...', req.user)
    if (!req.isAuthenticated()) {
        // this is to check if a user is logged in before having access to some links
        req.session.returnTo = req.originalUrl
        //this stores the original url the user was initially trying to access
        req.flash('error', 'You must be logged in')
        return res.redirect('/login')
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}
module.exports.isAuthorised = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    } next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have the permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    } next()
}
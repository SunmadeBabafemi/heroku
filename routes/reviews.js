const express = require ('express')
const router = express.Router({mergeParams: true})
// the mergeParams is meant to merge the campground id to the
// campground.reviews.push(review) on line 26
const Campground = require('../models/campground');
const Review = require('../models/review')
const reviews = require('../controllers/reviews')
const catchAsync =  require('../utilities/CatchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')


router.post('/', validateReview, isLoggedIn, catchAsync (reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router
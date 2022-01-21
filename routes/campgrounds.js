const express = require ('express')
const router = express.Router()
const catchAsync =  require('../utilities/CatchAsync');
const campgrounds = require('../controllers/campgrounds')
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthorised } = require('../middleware')
const multer  = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })
// this stores our files in our storage instance created in cloudinary


router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('campground[image]'), validateCampground, catchAsync(campgrounds.createNew))

    
router.get('/new', isLoggedIn, campgrounds.renderNew)

router.route('/:id')
    .get(catchAsync(campgrounds.showPage))
    .put(isLoggedIn, isAuthorised, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthorised, catchAsync(campgrounds.deleteCampground))

    
router.get('/:id/edit', isLoggedIn, isAuthorised, catchAsync(campgrounds.renderEditForm))

module.exports = router
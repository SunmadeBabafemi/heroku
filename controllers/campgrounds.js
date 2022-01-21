const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mbToken = process.env.MAPBOX_TOKEN
const geoCoder = mbxGeocoding({accessToken: mbToken})
const {cloudinary} = require('../cloudinary')
// this is required in other to perfrom CRUD funtionality on our cloudinary storage

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

module.exports.renderNew = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createNew = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id
    await campground.save();
    console.log(campground)
    req.flash('success', 'New campground created!!')
    res.redirect(`/campgrounds/${campground._id}`)    
}

module.exports.showPage = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
    // this is to make available the author of the camground, the review on the campground,
    // and the author of the review
    if (!campground) {
        req.flash('error', 'cannot find that campground!')
        res.redirect('/campgrounds')  
    }
    res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'cannot find that campground!')
        return res.redirect('/campgrounds')  
    }
    res.render('campgrounds/edit', { campground })

}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground})
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    // the mongoose validations only sees the images as arrays of objects not arrays of arrays
    // hence the imgs need to be spreaded with the spread operator (...) to access the files inside each array
    campground.images.push(...imgs)
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        // this enables deleting files from our cloudinary storage
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
        console.log(campground)
    }
    req.flash('success', 'Campground updated!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted!')
    res.redirect('/campgrounds');
}
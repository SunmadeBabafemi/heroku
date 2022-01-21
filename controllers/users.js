const User = require('../models/user')

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req, res) => {
    try{
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const regUser = await User.register(user, password)
        req.login(regUser, err => {
            if (err) return next(err)
            req.flash('success','Welcome to yelp camp')
            res.redirect('/campgrounds')
        })        
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }

}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser =  (req, res) => {
    req.flash('success','Welcome back')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    // delete req.session.returnTo
    res.redirect(redirectUrl)
    // 
 }

 module.exports.logOutUser = (req, res) => {
    req.logout()
    req.flash('success', 'Logged out successfully')
    res.redirect('/campgrounds')
}
const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user')
const catchAsync = require ('../utilities/CatchAsync')
const users = require('../controllers/users')

router.route('/register')
    .get(users.renderRegister )
    .post(catchAsync(users.registerUser))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}), users.loginUser)

router.get('/logout', users.logOutUser)

module.exports = router
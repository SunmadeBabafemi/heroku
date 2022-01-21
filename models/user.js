const mongoose = require('mongoose')
const passportlLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

UserSchema.plugin(passportlLocalMongoose)
// this helps add both username and password to our user model

module.exports = mongoose.model('User', UserSchema)
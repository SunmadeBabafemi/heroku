if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}



const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const {campgroundSchema, reviewSchema} = require('./schema')
const ExpressError = require('./utilities/ExpressError')
const Campground = require('./models/campground');
const Review = require('./models/review')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')
const helmet = require('helmet')
const MongoStore = require('connect-mongo');


const mongoSanitize = require('express-mongo-sanitize')

const campgroundRoutes = require ('./routes/campgrounds')
const reviewRoutes = require ('./routes/reviews')
const userRoutes = require('./routes/users');

//'mongodb://localhost:27017/yelpCamp'  process.env.DB_URL
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelpCamp'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,  
    // useCreateIndex: true
})
.then(()=>{
    console.log('MONGO CONNECTION OPEN!!')
})
.catch((err)=>{
    console.log('OOPS!! MONGO ERROR')
    console.log(err)
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
// this is to serve the 'public' directory
app.use(mongoSanitize());

const secret = process.env.SECRET || 'rosicky'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
})

store.on("error", function(e) {
    console.log("SESSION ERROR!", e)
})

const sessionConfig = {
    store,
    name: 'thomas',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}



app.use(session(sessionConfig))
app.use(flash())
// app.use(helmet()) 

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css",
    "https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.js",
    
];
const fontSrcUrls = [];
const imgSrcs = [
    "https://res.cloudinary.com/summymozart/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
    "https://images.unsplash.com/",
    "https://media.istockphoto.com/",


]
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                ...imgSrcs
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    // console.log(req.query)
    res.locals.currentUser = req.user
    // this grants access to current userr in all templates
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500, } = err
    if (!err.message) err.message ='Something went wrong'
    res.status(statusCode).render('error', { err }) 
})

app.listen(3000, ()=>{
    console.log('LISTENING ON PORT 3000!!')
})

//
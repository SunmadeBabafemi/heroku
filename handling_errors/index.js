const express = require('express');
const app = express()
const morgan = require('morgan');

const AppError = require('./AppError')

app.use(morgan('tiny'));

app.use((req, res, next) => {
    req.requestTime = Date.now();
    console.log(req.method, req.path);
    next()
})

app.use('/dogs', (req, res, next) => {
    console.log('I LOVE DOGS!!');
    next()
})

const verifyPassword = (req, res, next) => {
    const { password } = req.query;
    if(password === "rosicky") {
        next();
    }
    // res.send('hey Password needed!!')
    res.status(401)
    throw new AppError('hey Password needed!!', 401)
}

app.get('/error', (req, res) => {
    chicken.fly()
})

app.get('/dogs', (req, res) => {
    console.log(`REQUEST DATE: ${req.requestTime}`)
    res.send('WOOF WOOF')
})

app.get('/secret', verifyPassword, (req, res) => {
    res.send("Here's my secret.. God is still on the throne!!")
})


app.use((req, res) => {
    res.status(404).send('NOT FOUND!!!')
})

// app.use((err, req, res, next) => {
//     console.log('EEEEEEEEEEEERRRRRRRRRRRRRROOOOOOOOORRRRRRRRRR')
//     console.log(err)
//     next(err)
// })

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).send(message)
})

app.listen(2000, () => {
    console.log('App is running on port 2000!!!')
})
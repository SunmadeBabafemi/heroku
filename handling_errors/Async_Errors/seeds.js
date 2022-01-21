const mongoose = require('mongoose');
const Product = require('./models/product')

mongoose.connect('mongodb://localhost:27017/farmCounter1', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('MONGO CONNECTION OPEN!!')
    })
    .catch((err)=>{
        console.log('OOPS!! MONGO ERROR')
        console.log(err)
    })

// const p = new Product({
//     name: 'salsup',
//     price: 1.50,
//     category: 'fruit'
// })

// p.save()
//     .then(p => {
//         console.log(p)
//     })
//     .catch(e => {
//         console.log(e)
//     })

const seedProducts = [
    {
        name: 'watermelon',
        price: 3.40,
        category: 'fruit'
    },
    {
        name: 'yam',
        price: 2.50,
        category: 'crop'
    },
    {
        name: 'Efo tete',
        price: 0.65,
        category: 'vegetable'
    },
    {
        name: 'potato',
        price: 0.75,
        category: 'crop'
    },
    {
        name: 'ugu',
        price: 1.00,
        category: 'vegetable'
    },
]

Product.insertMany(seedProducts)
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })

// Product.then(() => {
//     mongoose.connection.close()
// })
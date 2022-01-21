const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground')

mongoose.connect('mongodb://localhost:27017/yelpCamp', {useNewUrlParser: true, useUnifiedTopology: true, })
.then(()=>{
    console.log('MONGO CONNECTION OPEN!!')
})
.catch((err)=>{
    console.log('OOPS!! MONGO ERROR')
    console.log(err)
})


const sample = array => array[Math.floor(Math.random()* array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random()*1000);
        const campPrice = Math.floor(Math.random()*20 + 5)
        const camp = new Campground ({
            author: '61c5bf085a0499a2e339a7ee',
            location: `${cities[random1000].city}, ${cities[random1000].state} `,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: { type : "Point", coordinates : [ cities[random1000].longitude, cities[random1000].latitude ] },
            images:  [
                {
                  url: 'https://res.cloudinary.com/summymozart/image/upload/v1641381538/YelpCamp/op65feqlswil12yh2gwv.jpg',
                  filename: 'YelpCamp/lbmzqsp3npte73ibzkoa',
                },
                
                {
                  url: 'https://res.cloudinary.com/summymozart/image/upload/v1641381539/YelpCamp/lpo1tlyiqvusvxkyyhf6.jpg',
                  filename: 'YelpCamp/twtnwsuaxxxxplhoigiz',
                },
              ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit ipsam consequuntur minus est iure praesentium? Delectus, accusamus ex laudantium architecto dolores, illo quam quae impedit excepturi hic perspiciatis, quaerat modi.',
            price: campPrice
        })
        await camp.save();
    }
}

seedDB().then (() => {
    mongoose.connection.close()
});
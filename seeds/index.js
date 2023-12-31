const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campgrounds');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "64dbca3771bf305a4e87c100",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            image: [
                {
                    "url" : "https://res.cloudinary.com/de3lbizbc/image/upload/v1692706609/YelpCamp/vesjemaxghcsz3d85vbr.jpg",
                    "filename" : "YelpCamp/vesjemaxghcsz3d85vbr"
                    
                },
                {
                    "url" : "https://res.cloudinary.com/de3lbizbc/image/upload/v1692706609/YelpCamp/w5sizkdredvgkjgkyzsb.jpg",
                    "filename" : "YelpCamp/w5sizkdredvgkjgkyzsb"
                    
                },
                {
                    "url" : "https://res.cloudinary.com/de3lbizbc/image/upload/v1692706609/YelpCamp/a57vkht0e1cylpbumtfd.jpg",
                    "filename" : "YelpCamp/a57vkht0e1cylpbumtfd"
                    
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
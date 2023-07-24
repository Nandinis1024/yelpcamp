const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const path = require("path");
const methodOverride = require('method-override')
const Campground = require("./models/campgrounds");
const Review = require("./models/reviews");

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection error"));
db.once("open",()=> {
    console.log("Database connected successfully");
    });

const app = express();
const port = 3000;

app.engine('ejs', ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


app.get("/", (req, res)=>{
    res.render("home");
})
app.get("/campgrounds", catchAsync(async (req, res)=>{
    const campgrounds= await Campground.find({});
    res.render("campgrounds/index", {campgrounds: campgrounds})

}))

app.get("/campgrounds/new", catchAsync(async (req, res)=>{
    res.render("campgrounds/new")
}))

app.post("/campgrounds", validateCampground, catchAsync(async(req, res, next)=>{
    if(!req.body.campground) throw new ExpressError("invalid campground data", 400);
    let newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`)
    
}))
app.get("/campgrounds/:id", catchAsync(async (req, res)=>{
    const campground = await Campground.find({_id: req.params.id}).populate('reviews');
    //console.log(typeof(campground));

    res.render("campgrounds/show", {campground: campground})

}))
app.get("/campgrounds/:id/edit", catchAsync(async (req, res)=>{
    const campground = await Campground.findById(req.params.id)
    //console.log(campground);
    res.render("campgrounds/edit", {campground: campground})

}))

app.put("/campgrounds/:id", validateCampground, catchAsync(async(req, res)=>{
   const  { id } = req.params;
   const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
   res.redirect(`/campgrounds/${campground._id}`)
 

}))

app.delete("/campgrounds/:id", catchAsync(async(req, res)=>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id)
    res.redirect("/campgrounds")
}))

app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async(req, res)=>{
    //console.log("kjkdk");
    const id = req.params.id;
    const campground = await Campground.findById(id);
    // console.log(campground);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    // console.log(campground);
    res.redirect(`/campgrounds/${id}`);
}))

app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async(req, res)=>{
    // res.send("delete me");
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);


}))

app.all("*",(req, res, next)=>{
    next(new ExpressError("page not found", 404))
})
app.use((err, req, res, next)=>{
    const { statusCode = 500 }= err;
    if(!err.message) err.message = "oh boy! something went wrong";
    res.status(statusCode).render("campgrounds/error", {err});
})

app.listen(port, ()=>{
    console.log(`http://localhost:${port}`);
})

const Campground = require('../models/campgrounds');
const ExpressError = require('../utils/expressError');
const Review = require('../models/reviews');
const { reviewSchema } = require('../schemas.js');


module.exports.create = async(req, res)=>{
    //console.log("kjkdk");
    const id = req.params.id;
    const campground = await Campground.findById(id);
    // console.log(campground);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    // console.log(campground);
    req.flash('success', 'Created new review!');
    res.redirect(`/campgrounds/${id}`);
}



module.exports.delete = async(req, res)=>{
    // res.send("delete me");
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}
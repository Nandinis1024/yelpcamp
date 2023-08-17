const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campgrounds');
const { validateReview, isLoggedIn } = require('../middleware');
const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviews');
const { reviewSchema } = require('../schemas.js');


router.post("/", isLoggedIn, validateReview, catchAsync(async(req, res)=>{
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
}))

router.delete("/:reviewId", isLoggedIn, catchAsync(async(req, res)=>{
    // res.send("delete me");
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);


}))

module.exports = router;
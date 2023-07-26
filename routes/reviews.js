const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campgrounds');
const Review = require('../models/reviews');

const { reviewSchema } = require('../schemas.js');


const ExpressError = require('../utils/expressError');
const catchAsync = require('../utils/catchAsync');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post("/", validateReview, catchAsync(async(req, res)=>{
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

router.delete("/:reviewId", catchAsync(async(req, res)=>{
    // res.send("delete me");
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);


}))

module.exports = router;
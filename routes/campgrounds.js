const express = require("express");
const router = express.Router();
const { campgroundSchema } = require('../schemas.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const Campground = require("../models/campgrounds");

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get("/", catchAsync(async (req, res)=>{
    const campgrounds= await Campground.find({});
    res.render("campgrounds/index", {campgrounds: campgrounds})

}))

router.get("/new", catchAsync(async (req, res)=>{
    res.render("campgrounds/new")
}))

router.post("/", validateCampground, catchAsync(async(req, res, next)=>{
    if(!req.body.campground) throw new ExpressError("invalid campground data", 400);
    let newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`)
    
}))
router.get("/:id", catchAsync(async (req, res)=>{
    const campground = await Campground.find({_id: req.params.id}).populate('reviews');
    //console.log(typeof(campground));
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", {campground: campground})

}))
router.get("/:id/edit", catchAsync(async (req, res)=>{
    const campground = await Campground.findById(req.params.id)
    //console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", {campground: campground})

}))

router.put("/:id", validateCampground, catchAsync(async(req, res)=>{
   const  { id } = req.params;
   const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
   req.flash('success', 'Successfully updated campground!');
   res.redirect(`/campgrounds/${campground._id}`)
 

}))

router.delete("/:id", catchAsync(async(req, res)=>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect("/campgrounds")
}))

module.exports = router;
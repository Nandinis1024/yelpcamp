const Campground = require("../models/campgrounds");
const { campgroundSchema } = require('../schemas.js');
const ExpressError = require('../utils/expressError');

module.exports.index = async (req, res)=>{
    const campgrounds= await Campground.find({});
    res.render("campgrounds/index", {campgrounds: campgrounds})}


module.exports.renderNewForm = async (req, res)=>{
    res.render("campgrounds/new")} 

    
module.exports.createNew = async(req, res, next)=>{
    if(!req.body.campground) throw new ExpressError("invalid campground data", 400);
    let newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${newCampground._id}`)} 

    
module.exports.show = async (req, res)=>{
    const campground = await Campground.find({_id: req.params.id}).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    //console.log(typeof(campground));
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", {campground: campground})}
    

module.exports.renderEditForm = async (req, res)=>{
    const campground = await Campground.findById(req.params.id)
    //console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", {campground: campground})}


    
module.exports.edit = async(req, res)=>{
    const  { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)}
    
    
module.exports.delete = async(req, res)=>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect("/campgrounds")}    
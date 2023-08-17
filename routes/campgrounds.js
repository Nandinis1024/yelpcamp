const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require("../controllers/campgrounds")


router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createNew))


router.get("/new", isLoggedIn,  catchAsync(campgrounds.renderNewForm));


router.route("/:id")
    .get(catchAsync(campgrounds.show))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.edit))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.delete))


router.get("/:id/edit",isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));


module.exports = router;
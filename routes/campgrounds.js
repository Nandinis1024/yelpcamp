const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require("../controllers/campgrounds")



router.get("/", catchAsync(campgrounds.index));

router.get("/new", isLoggedIn,  catchAsync(campgrounds.renderNewForm));

router.post("/", isLoggedIn, validateCampground, catchAsync(campgrounds.createNew));

router.get("/:id", catchAsync(campgrounds.show));

router.get("/:id/edit",isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.edit));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.delete));

module.exports = router;
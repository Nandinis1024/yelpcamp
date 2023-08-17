const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn } = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const reviews = require("../controllers/reviews");



router.post("/", isLoggedIn, validateReview, catchAsync(reviews.create));

router.delete("/:reviewId", isLoggedIn, catchAsync(reviews.delete));

module.exports = router;
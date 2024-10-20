const express = require("express");
const reviewrouter = express.Router({mergeParams:true});
const mongooose = require("mongoose");
const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExrpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const {isLoggedIn, isOwner,validateReviews , isReviewAuthor} = require("../middleware.js");
const ReviewController = require("../controller/review.js");


// create review

reviewrouter.post("/reviews",isLoggedIn,validateReviews, wrapAsync(ReviewController.newReview))

//delete review

reviewrouter.delete("/reviews/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(ReviewController.deleteReview))

module.exports = reviewrouter;
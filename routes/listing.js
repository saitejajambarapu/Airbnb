const express = require("express");
const router = express();
const mongooose = require("mongoose");
const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExrpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const {isLoggedIn, isOwner , validateListing } = require("../middleware.js");
const ListingController = require("../controller/listing.js");
const multer = require('multer');
const {storage}= require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
.get(wrapAsync(ListingController.indexPage))
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(ListingController.savePost));


router.get("/new", isLoggedIn, wrapAsync(ListingController.newPost))

router.get("/filter/:id", wrapAsync(ListingController.filterRouteCount))
router.get("/filters/:id", wrapAsync(ListingController.filterRoute))
router.post("/search", wrapAsync(ListingController.searchListings))

router.route("/:id")
.get( wrapAsync(ListingController.viewPost))
.put(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(ListingController.updatePost))
.delete(isLoggedIn,isOwner, wrapAsync(ListingController.deletePost));


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.editPost))



module.exports = router;
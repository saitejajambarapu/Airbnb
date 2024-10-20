const Listing = require("../models/listings.js");
const Review = require("../models/reviews.js");

module.exports.newReview = async(req, res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(listing)
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success","Review Added Successfully!");
    console.log(listing);
    console.log(listing.reviews[0]);
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req,res)=>{
    let{id , reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
} 
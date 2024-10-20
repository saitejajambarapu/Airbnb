const Listing = require("./models/listings.js");
const Review = require("./models/reviews.js");
const ExpressError = require("./utils/ExrpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        
        req.flash("error","Please Login!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner =async (req,res,next)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.isloggedin._id)){
        req.flash("error","Not Authorized");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor =async (req,res,next)=>{
    let { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.isloggedin._id)){
        req.flash("error","Not Authorized to Delete the Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateReviews  = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.validateListing  = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}
const {cloudinary}= require("../cloudConfig.js");
const Listing = require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});

let publicId =  0;


module.exports.newPost = async (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.indexPage = async (req, res) => {
    const listings = await Listing.find({});

    res.render("listings/index.ejs", { listings });
}

module.exports.savePost = async (req, res, next) => {
    
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit:1, 
    }).send();
    console.log(response.body.features[0].geometry);
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = {url , filename};
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
}

module.exports.viewPost = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing is Not Available!");
        res.redirect("/listings");
    }
    res.render("listings/id.ejs", { listing });
}

module.exports.filterRouteCount = async (req, res) => {
    const { id } = req.params;
    if(id=="trending"){
        const listings = await Listing.aggregate([
            { $sort: { price: -1 } }, // Sort by price in descending order
            { $limit: 5 } // Limit to the top 5
            
        ]);
        req.flash("success",`${listings.length} Listings Found!`)
        return res.redirect(`/listings/filters/${id}`);
    }
    const filteredListings = await Listing.find({ category: id })
    if(filteredListings.length>0){
        req.flash("success",`${filteredListings.length} Listings Found!`)
    }else{
        req.flash("error", "Listings are Not Available!");
            return res.redirect("/listings");
    }
    res.redirect(`/listings/filters/${id}`);
}

module.exports.filterRoute = async (req, res) => {
    let { id } = req.params;
    try {
        if(id=="trending"){
            const listings = await Listing.aggregate([
                { $sort: { price: -1 } }, // Sort by price in descending order
                { $limit: 5 } // Limit to the top 5
            ]);
            return res.render("listings/index.ejs",{listings});
        }
        const listings = await Listing.find({ category: id });
        return res.render("listings/index.ejs", { listings });// Redirect to ensure flash works on the next page
    } catch (error) {
        console.error("Error fetching listings:", error);
        req.flash("error", "An error occurred while fetching listings.");
        return res.redirect("/listings");
    }
}

module.exports.editPost = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    publicId = listing.image.filename;
    listing.image.url = listing.image.url.replace("/upload","/upload/w_250");
    console.log(listing.image.url);
    if(!listing){
        req.flash("error","Listing is Not Available!");
        res.redirect("/listings");
    } 
    res.render("listings/update.ejs", { listing });
}

module.exports.updatePost = async (req, res) => {
    try {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit:1, 
        }).send();
        console.log(response.body.features[0].geometry);
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        listing.geometry = response.body.features[0].geometry;
        await listing.save();
        if(typeof req.file !=="undefined"){
            const result = await cloudinary.uploader.destroy(publicId);
            console.log('Delete result:', result);
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = {url,filename};
            await listing.save();
        }
        req.flash("success","Listing Updated");
        res.redirect(`/listings/${id}`);
        
      } catch (error) {
        console.error('Error deleting image:', error);
        req.flash("success","Listing Updated");
        res.redirect(`/listings/${id}`);
      }
    
}

module.exports.deletePost = async (req, res) => {
    let { id } = req.params;
    let deletedLising = await Listing.findByIdAndDelete(id);
    publicId = deletedLising.image.filename;
    console.log(deletedLising);
    const result = await cloudinary.uploader.destroy(publicId);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}

//search

module.exports.searchListings = async (req, res) => {
    const  keyword = req.body.keyword; // Assume the keyword is passed as a query parameter
    try {
        const listings = await Listing.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } }, // Case-insensitive search in name
                { description: { $regex: keyword, $options: 'i' } }, // Case-insensitive search in description
                { location: { $regex: keyword, $options: 'i' } } // Case-insensitive search in location
            ]
        });

        if (listings.length > 0) {
            return res.render("listings/index.ejs", { listings });
        } else {
            req.flash("error", "No listings found matching your search.");
            return res.redirect("/listings");
        }
    } catch (error) {
        console.error("Error fetching listings:", error);
        req.flash("error", "An error occurred while fetching listings.");
        return res.redirect("/listings");
    }
};
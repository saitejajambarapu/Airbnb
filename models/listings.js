const mongooose = require("mongoose");
const Schema = mongooose.Schema;
const Reviews = require("./reviews.js");
const User = require("./user.js");
const { ref } = require("joi");
// "https://w0.peakpx.com/wallpaper/464/552/HD-wallpaper-sunset-scenery-beach-grand-theft-auto-gta-gta5.jpg",
//         Set: (v)=> v==="" ? "https://w0.peakpx.com/wallpaper/464/552/HD-wallpaper-sunset-scenery-beach-grand-theft-auto-gta-gta5.jpg": v,
    
const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    image: {

        url: String,
        filename:String,
    },
    category: {
        type: String,
        required : true,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type:Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    await Reviews.deleteMany({_id: {$in: listing.reviews}});
})

const ListingSchema = mongooose.model("Listing",listingSchema);
module.exports = ListingSchema;
const mongooose = require("mongoose");
const Schema = mongooose.Schema;
const User = require("./user.js");

const reviewSchema = new Schema({
    author: {
        type:Schema.Types.ObjectId,
        ref: "User",
    },
    comment: {type: String,
        required: true,
    },
    rating:{
        type: Number,
        required: true,
        min: 1,
        max: 5,},
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    }
);

module.exports = mongooose.model("Review", reviewSchema);

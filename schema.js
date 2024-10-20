const joi = require('joi');
const reviews = require('./models/reviews');
const Joi = require('joi');

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        country: joi.string().required(),
        location: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.string().allow("",null),
        category: joi.string().required(),
    }).required()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating:joi.number().min(1).max(5),
        comment: joi.string().required(),
    }).required()
})
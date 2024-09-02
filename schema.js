const Joi = require("joi");


module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.string().allow("",null), 
        price:Joi.number().required().min(0),
        location:Joi.string().required(),
        country:Joi.string().required(), 
        discount:Joi.boolean().required(),
        discountAmount: Joi.number().min(0).required()     
    }).required(),
});


module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
});

module.exports.tourmatePostSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    tourDate: Joi.date().required(),
    numberOfDays: Joi.number().required().min(1),
    people: Joi.number().required().min(1),
    socialMedia: Joi.string().optional().allow(""),
    contact: Joi.string().required(),
    email: Joi.string().email().required(),
    requirements: Joi.string().optional().allow(""),
    estimatedCost: Joi.number().required().min(0),
    about: Joi.string().optional().allow("")
});



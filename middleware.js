const user = require("./models/user");
const Listing = require ("./models/listing.js");
const {listingSchema} = require("./schema.js");
const ExpressError = require("./utilis/expressError.js");
const {tourmatePostSchema} = require("./schema");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please login first");
        return res.redirect("/login");
    }
    
    next();
};

module.exports.saveRedirectUrl =(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.saveRedirectUrl = req.session.redirectUrl;
    };
    next();
    
};

module.exports.isOwner = async(req,res,next)=>{

    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    if( !listing.owner.equals(res.locals.currentUser._id)){
     
     req.flash("error","You are not the owner");
     return res.redirect(`/listings/${id}`);
 
    }
    next();
};
module.exports.validateListing = (req, res, next) => {
        req.body.listing.discount = req.body.listing.discount === 'yes';
        req.body.listing.discountAmount = req.body.listing.discount ? parseFloat(req.body.listing.discountAmount) : 0;
    
        let { error } = listingSchema.validate(req.body);
        if (error) {
            const errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
        } else {
            next();
        }
    };
    
module.exports.validateTourmatePost = (req, res, next) => {
        let { error } = tourmatePostSchema.validate(req.body);
        if (error) {
            const errMsg = error.details.map((el) => el.message).join(",");
            throw new ExpressError(400, errMsg);
        } else {
            next();
        }
    };
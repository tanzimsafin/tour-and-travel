const Listing = require ("../models/listing.js");
const ExpressError = require("../utilis/expressError.js");

let mapToken = process.env.mapToken;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

  

// geocoding with countries

module.exports.allListings =async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.addListingsForm =(req,res) =>{

    res.render("listings/addNew.ejs");
 };

module.exports.addListings =async (req,res,next) =>{
    
    let responce = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
    
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id ;
    newListing.image = {url,filename};
    newListing.geomatry = responce.body.features[0].geometry ;
    await newListing.save();
    req.flash("success","New listing created");
    res.redirect("/listings");
    
 };

 module.exports.indivisualListings = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        throw new ExpressError(500, "Listing not found");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.updateListingsForm =async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }
module.exports.updateListings =async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename}
        await listing.save();

    }
    else{
        await listing.save();
    }
    req.flash("success","Updated successfully");
    res.redirect(`/listings/${id}`);
 }

 module.exports.deleteListings =async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted successfully");
    res.redirect("/listings");
  }
//  controller action for showing a listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render('listings/show', { listing });
};
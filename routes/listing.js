const express = require('express')
const router= express.Router();
const wrapAsync=require("../utills/wrapasync.js")
const Listing = require("../models/listing.js");
const{isloggedin, Isowner}=require("../midleware.js")


router.get("/",async(req,res)=>{
const allListings=await Listing.find({});
res.render("listing/index.ejs",{allListings})
})

//New Route
router.get("/new",isloggedin, (req, res) => {
  if(!req.isAuthenticated()){
    req.flash("error","you have to login first!")
    return res.redirect("/login")
  }
  res.render("listing/new.ejs");
});


//Show Route
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
 const cot=listing.country;
   const newlist = await Listing.find({
      _id: { $ne: listing._id },         // Exclude current listing
      country: cot                       // Same country
    }).limit(3);
  res.render("listing/show.ejs", { listing,newlist });
});

// name: { $ne: "Taj Mahal" }

//Create Route
router.post("/", isloggedin ,wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  await newListing.save();
  req.flash("success","new listing created")
  res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",isloggedin,Isowner, async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit.ejs", { listing });

});
//update
router.put("/:id", isloggedin,Isowner,async (req, res) => {
  let { id } = req.params;
  
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Edit saved")
   res.redirect(`/listings/${id}`);
});
//Delete Route
router.delete("/:id",isloggedin ,Isowner, async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success","listing deleted")
  res.redirect("/listings");
});
module.exports=router;

//listing.card

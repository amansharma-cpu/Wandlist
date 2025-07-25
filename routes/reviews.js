const express = require('express')
const router= express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync=require("../utills/wrapasync.js")
const Review = require("../models/reviews.js");
// reviews
router.post("/", async(req,res)=>{
let listing =await Listing.findById(req.params.id);
let newReview= new Review(req.body.review);

listing.reviews.push(newReview);
await newReview.save();
await listing.save();
  req.flash("success","new review created")
res.redirect(`/listings/${listing._id}`);
})

// delete review
router.delete("/:reviewid",wrapAsync(async(req,res)=>{
  let {id,reviewid}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews: reviewid}})
  await Review.findByIdAndDelete(reviewid);
    req.flash("success","Review deleted")
  res.redirect(`/listings/${id}`)
}))
module.exports=router;
const Listing = require("./models/listing.js");

module.exports.isloggedin=(req,res,next)=>{
 
    if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
  
    req.flash("error","you have to login first!")
    return res.redirect("/login")
  }
  next()
}

module.exports.saveredirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=  req.session.redirectUrl
   
  }
  next();
}

module.exports.Isowner=async(req,res,next)=>{
  let { id } = req.params;
  let listing= await Listing.findById(id)
  if(! listing.owner.equals(  res.locals.curuser._id)){
    req.flash("error","you are not owner of this listing")
    return res.redirect(`/listings/${id}`);
  }
   next();
}

const express = require('express')
const router= express.Router();
const user=require("../models/user.js");
const passport = require('passport');
const {saveredirectUrl}=require("../midleware.js")

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})


router.post("/signup",async(req,res)=>{

  try{
  let{username,email,password}=req.body;
  const newuser=user({email,username})
  const registeruser=await user.register(newuser,password)
  req.logIn(registeruser,(err)=>{
    if(err){
      return next(err)
    }
  req.flash("success","New User Add Successfully")
  res.redirect("/listings")
  })

}catch (e){
    req.flash("error", e.message)
    res.redirect("/signup")
  }
  
})
router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})

router.post("/login",saveredirectUrl  ,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),async(req,res)=>{
req.flash("success","WELCOME TO WANDLIST");
let redirecturl=res.locals.redirectUrl ||"/listings"
res.redirect( redirecturl)
})

router.get("/logout",(req,res,next)=>{
  req.logOut((err)=>{
   if(err){
    return next(err)
   }
   req.flash("success","you are logged out successfully")
   res.redirect("/listings")
  })
})


module.exports=router;
require('dotenv').config()

const express = require('express')
const app = express();
const Listing = require("./models/listing.js");
const mongoose=require("mongoose");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsmate=require("ejs-mate");
app.engine('ejs', ejsmate);
const wrapAsync=require("./utills/wrapasync.js")
const ExpressError=require("./utills/ExpressError.js");
const Review = require("./models/reviews.js");
const listings=require("./routes/listing.js")
const User =require("./routes/user.js")
const review=require("./routes/reviews.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');

const flash=require("connect-flash")
const passport=require("passport");
const localstrategy=require("passport-local");
const user=require("./models/user.js")

app.use(express.static(path.join(__dirname,"/public")))
main().then(()=>{
    console.log("conection sucessfull")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.mongo);
}

const store=MongoStore.create({
  mongoUrl: process.env.mongo,
  secret:process.env.SECRET,
  touchAfter:24*3600
})
const sessionOption={
  store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized : true,
    Cookie: {
      expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }

app.use(session(sessionOption))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()))
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())





app.use((req,res,next)=>{
   res.locals.success=req.flash("success")
   res.locals.error=req.flash("error")
   res.locals.curuser=req.user
  
 next();
})

 app. use("/listings",listings)
 app. use("/listings/:id/reviews",review)
  app. use("/",User)

  // search
  app.get("/search",async(req,res)=>{
    let { search} = req.query;
     let count= await  Listing.find({country:search})
    res.render("listing/search.ejs", { count });
  })
  app.get("/card",async(req,res)=>{
   const { guests, infants, pets ,price} = req.query;
  
  res.render("listing/card.ejs",{guests, infants, pets,price})
})

  





// app. get("/testlisting", async(req,res)=>{
//    sampleListing=new Listing({
//       title:"my new villa",
//       description:"by beach",
//       price:1200,
//       locatio:"Goa",
//       country:"india"

//     })

    
//    await sampleListing.save()
//    console.log("sample was save")
//    res.send("hi")
// })



// app.get("/",(req,res)=>{
//   res.send("hi i am root");
// })

// app.all("*",(req,res,next)=>{
//   next(new ExpressError(404, "page not found"))
// })
// app.use((err,req,res,next)=>{
//  let {statuscode,message}=err;
//  res.status(statuscode).send(message)
 
// })

app.listen(8080, () =>{
    console.log("server is listen")
})

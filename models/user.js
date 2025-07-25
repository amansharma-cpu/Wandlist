const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmongoose=require("passport-local-mongoose")

const Userschema = new Schema({
  email:{
    type:String,
    required:true
  }
});
Userschema.plugin(passportlocalmongoose);
module.exports = mongoose.model('User', Userschema);

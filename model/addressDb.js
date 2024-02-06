const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    fname:{type:String,required:true},
    lname:{type:String,required:true},
    companyName:{type:String,required:true},
    country:{type:String,required:true},
    streetAdress:{type:String,required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    pincode:{type:Number,required:true},
    mobile:{type:Number,required:true},
    email:{type:String,required:true}


})
modole.exports=mongoose.model('address',addressSchema)
const mongoose= require('mongoose')

const otpSchema= new mongoose.Schema({
    userId:{type:String,required:true},
    emailId:{type:String,required:true},
    otp:{type:Number,required:true}
    // expr:{type:String,required:true}





})
module.exports=mongoose.model('otp',otpSchema)
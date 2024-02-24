const mongoose= require('mongoose')
const couponSchema= new mongoose.Schema({

name:{type:String,required:true},
amount:{type:Number,required:true},
couponId:{type:String,required:true},
method:{type:String,required:true},
createDate:{type:Date,required:true},
exprDate:{type:Date,required:true},
users:[{clientId:{type:mongoose.Schema.Types.ObjectId, ref:"client"}}]

})
module.exports=mongoose.model('coupon',couponSchema)
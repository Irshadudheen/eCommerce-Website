const mongoose = require('mongoose');
const offerSchema = mongoose.Schema({
    name:{type:String,required:true},
    categoryId:{type:mongoose.Schema.Types.ObjectId,ref:'category'},
    productId:{type:mongoose.Schema.Types.ObjectId,ref:'product'},
    expreDate:{type:Date,required:true},
    createDate:{type:Date,required:true},
    amount:{type:Number,required:true},
   
})
module.exports=mongoose.model('offer',offerSchema)
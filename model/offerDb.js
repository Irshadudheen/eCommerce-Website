const mongoose = require('mongoose');
const offerSchema = mongoose.Schema({
    name:{type:String,required:true},
    categoryId:{type:mongoose.Schema.Types.ObjectId,ref:'category'},
    productId:{type:mongoose.Schema.Types.ObjectId,ref:'product'},
    expreDate:{type:Date,required:true},
    createDate:{type:Date,required:true},
    amount:{type:Number,required:true},
    description:{type:String,required:true},
    method:{type:String,required:true},
    image:{type:String,required:true}
})
module.exports=mongoose.model('offer',offerSchema)
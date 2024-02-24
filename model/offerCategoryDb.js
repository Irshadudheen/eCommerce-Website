const mongoose = require('mongoose');
const offerCategorySchema = mongoose.Schema({
    name:{type:String,required:true},
    categoryId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'category'},
    expreDate:{type:Date,required:true},
    createDate:{type:Date,required:true},
    amount:{type:Number,required:true},
    description:{type:String,required:true},
    method:{type:String,required:true},
    image:{type:String,required:true}
})
module.exports=mongoose.model('offerCategory',offerCategorySchema)
const mongoose =require('mongoose')

const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    status:{type:String,required:true},
    quantity:{type:Number,required:true},
    categoryid:{type:String,required:true},
    createdate:{type:String,required:true},
    image:{type:Array,required:true},
    productDescription:{type:String,required:true}
    // size:{type:String,required:true},
    // color:{type:String,required:true},
    // pannerId:{type:String,required:true},
})
 module.exports=mongoose.model('product',productSchema)

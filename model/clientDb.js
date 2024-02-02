const mongoose = require('mongoose')

    const userSchema= new  mongoose.Schema({
        fname:{type:String,required:true},
        lname:{type:String,required:true},
        email:{type:String,required:true},
        mobile:{type:Number,required:true},
        password:{type:String,required:true},
        is_admin:{type:Boolean,required:true},
        is_varified:{type:Boolean,required:true,default:0},
        is_block:{type:Boolean,required:true}
})

module.exports=mongoose.model('client',userSchema)
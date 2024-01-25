const mongoose = require('mongoose')

    const userSchema= new  mongoose.Schema({
        name:{type:String,required:true},
        email:{type:String,required:true},
        mobile:{type:Number,required:true},
        is_admin:{type:Boolean,required:true},
        is_varified:{type:Boolean,required:true}
})

module.exports=mongoose.model('client',userSchema)
const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'client', required: true },
        products: [{productId: {type: mongoose.Schema.Types.ObjectId,ref: 'product',required: true},
        quantity: { type: Number, required:true},
      
        totalPrice: {type: Number,default: 0},
        image:{type:String}},],
        addressId:{type:mongoose.Schema.Types.ObjectId, ref:"address"},
        totalPrice:{type:Number,required:true},
        date:{type:Date,required:true}
       
    });
    
module.exports= mongoose.model('order',orderSchema)
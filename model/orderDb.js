const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
        userId:{type: mongoose.Schema.Types.ObjectId, required: true, ref: "client"},
        orderAmount:{type:Number,required:true},
        deliveryAddress:{type:String,required:true},
        deliveryDate:{type:Date,required:true},
        ShippingDate:{type:Date,required:true},
        orderedItems:{type:Array(mongoose.Schema.Types.ObjectId),required:true},
        payment:{type:mongoose.Schema.Types.ObjectId,required:true}

})
module.exports= mongoose.model('order',orderSchema)
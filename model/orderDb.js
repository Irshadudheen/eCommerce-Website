const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'client', required: true },
    addressId:{type:mongoose.Schema.Types.ObjectId,ref:'address',required:true},
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        quantity: { type: Number, required: true },

        totalPrice: { type: Number, required:true},
        image: { type: String },
        productStatus:{type:String,enum: ['Pending', 'Processing', 'Shipped', 'Delivered',"placed"], default: 'Pending'}
    },],
    paymentMethod:{type:String,require:true},
    dectription:{type:String},
    totalPrice: { type: Number, required: true },
    date: { type: Date, required: true },
    orderStatus: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered',"placed"], default: 'Pending' },
    payment: { type: Number, required: true }

});

module.exports = mongoose.model('order', orderSchema)
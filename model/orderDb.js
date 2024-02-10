const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'client', required: true },
        Products: [{
            products: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
            name: { type: String },
            price: { type: Number },
            Status: { type: String, default: 'placed' },
            quantity: { type: Number },
            total: { type: Number },
            image: { type: String }
        }],
        paymentMode: { type: String },
        paymentStatus: { type: String, default: "pending" }, 
        total: { type: Number },
        date: { type: Date },
        address: { type: Object }
    });
    
module.exports= mongoose.model('order',orderSchema)
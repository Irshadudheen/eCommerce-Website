
const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    UserId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "client" },
    productsid: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "product" },
    quantity: { type: Number, required: true },
    createdate: { type: Date, default: Date.now }

})

module.exports=mongoose.model('cart',cartSchema)
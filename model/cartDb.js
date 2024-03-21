
const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "client" },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        quantity: { type:Number, required: true }, },]

})

module.exports = mongoose.model('cart', cartSchema)
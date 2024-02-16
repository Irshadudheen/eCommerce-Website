
const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "client" },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        quantity: { type: Number, required: true },
        productPrice: { type: Number, required: true },
        totalPrice: { type: Number, default: 0 },
        image: { type: String }
    },]

})

module.exports = mongoose.model('cart', cartSchema)
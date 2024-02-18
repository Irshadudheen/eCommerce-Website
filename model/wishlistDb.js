const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
    clientId:{type: mongoose.Schema.Types.ObjectId, required: true, ref: "client"},
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        image: { type: String }
    },]
})
module.exports=mongoose.model('wishlist',wishlistSchema)
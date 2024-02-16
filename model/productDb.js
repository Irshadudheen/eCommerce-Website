const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, required: true },
    quantity: { type: Number, required: true },


    categoryid: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "category" },
    createdate: { type: String, required: true },
    image: { type: Array, required: true },
    productDescription: { type: String, required: true }

})
module.exports = mongoose.model('product', productSchema)

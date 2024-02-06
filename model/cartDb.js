
const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    clientId:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "client" },
    productsId:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "product" },
    quantity:{ type: Number, required: true },
    createdate:{ type: Date, default: Date.now }

})

module.exports=mongoose.model('cart',cartSchema)
const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({


    clientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "client" },
    country: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    mobile: { type: Number, required: true },



})
module.exports = mongoose.model('address', addressSchema)
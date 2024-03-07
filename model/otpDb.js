const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    emailId: { type: String, required: true },
    otp: { type: Number, required: true },
    expr: { type: Date, required: true, default: Date.now() }
    // expr:{type:String,required:true}


})
otpSchema.index({ expr: 1 }, { expireAfterSeconds: 120 })

module.exports = mongoose.model('OTP', otpSchema)
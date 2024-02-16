const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    emailId: { type: String, required: true },
    otp: { type: Number, required: true },
    expr: { type: Date, required: true, default: Date.now() }
    // expr:{type:String,required:true}


})
otpSchema.index({ expr: 1 }, { expireAfterSeconds: 120 })

module.exports = mongoose.model('OTP', otpSchema)
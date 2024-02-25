const mongoose = require("mongoose")

    const walletSchema = new mongoose.Schema({
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: "client", required: true },
        balance: { type: Number, default: 0 },
        referralCode: { type: String },
        referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "client" }] 
    })
module.exports=mongoose.model('wallet',walletSchema)


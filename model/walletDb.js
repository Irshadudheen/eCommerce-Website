const mongoose = require("mongoose")

    const walletSchema = new mongoose.Schema({
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: "client", required: true },
        balance: { type: Number, default: 0 },
        referralCode: { type: String },
        referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "client" }] ,
        history: [{
            type: { type: String, required: true }, 
            amount: { type: Number, required: true },
            timestamp: { type: Date, default: Date.now }, 
            description: { type: String } 
        }]
    })
module.exports=mongoose.model('wallet',walletSchema)


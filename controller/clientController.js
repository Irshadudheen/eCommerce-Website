const client = require("../model/clientDb")
const bycrypt = require("bycrypt")




const securePassword = async (password)=>{
    try {
        const passwordHash = await bycrypt.hash(password,10)
        return passwordHash
        
    } catch (error) {
        console.log(error.message)
        
    }
}

// const addressDb = require('../model/addressDb')

const editProfile = async(req,res)=>{
    try {
        res.render('editProfile')
        
    } catch (error) {
        console.log(error.message)
        
    }
}
module.exports={
    editProfile
}
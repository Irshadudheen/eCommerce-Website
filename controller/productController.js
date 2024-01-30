const productDb = require('../model/productDb')



const eachproduct = async (req,res)=>{
    try {
        res.render('eachproduct')
        
    } catch (error) {
        console.log(error.message)
        
    }
}
const productAdmin= async (req,res)=>{
    try {
        
        res.render('productAdmin')
    } catch (error) {
        console.log(error.message)
    }
}


module.exports={
    eachproduct,
    productAdmin
}
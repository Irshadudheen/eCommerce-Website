const productDb = require('../model/productDb')
const cartDb = require('../model/cartDb')
const clientDb = require('../model/clientDb')
const addToCart = async (req,res)=>{
    try {
        console.log(req.query)
        const {id}=req.body
        const checkProduct = await cartDb.findOne({productsId:id})
        if(!checkProduct){

            
            const productData = await productDb.findOne({_id:id})
        console.log(productData._id)
        console.log(req.session)
        // const userData = await clientDb.findOne({_id:req.session.user_id})
        if(productData){
            const cart = new cartDb({
                clientId:req.session.user_id,
                productsId:productData._id,
                quantity:productData.quantity
                
                
                
                
                
            })
            const cartsave = await cart.save()
            if(cartsave){
                console.log("cart is save")
                res.send({status:true})
            }
            
            
            
        }
        
      
                
            }else{
                console.log("product already added")
                res.send({status:false})
            }
            } catch (error) {
        console.log(error.message)
        
    }
}
//CARTVIEW
const cartView = async (req,res)=>{
    try {
        
        const cart = await cartDb.find({clientId:req.session.user_id}).populate("productsId").populate('clientId')
        // console.log(cart.productsId)
        console.log("---------------------------------------------------------",cart.length)
        
        
        res.render('cart',{cart})
        
    } catch (error) {
        console.log(error.message)
        
    }
}
//REMOVE CARD
const removeCard = async (req,res)=>{
    try {
        const {_id}=req.body
        const removeCard = await cartDb.deleteOne({_id})
        if(removeCard){
            res.send({status:true})
        }
        
    } catch (error) {
        console.log(error.message)
        
    }
}

module.exports = {
    addToCart,
    cartView,
    removeCard
}
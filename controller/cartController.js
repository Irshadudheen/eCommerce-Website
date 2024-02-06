const productDb = require('../model/productDb')
const cartDb = require('../model/cartDb')
const clientDb = require('../model/clientDb')
const addToCart = async (req,res)=>{
    try {
        console.log(req.query)
        const {id}=req.body
        const checkProduct = await productDb.findOne({_id:id})
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
            }
            
            
            
        }
        
      
                
            }else{
                console.log("product already added")
            }
            } catch (error) {
        console.log(error.message)
        
    }
}
//CARTVIEW
const cartView = async (req,res)=>{
    try {
        
        const cart = await cartDb.findOne({clientId:req.session.user_id}).populate("productsId").populate('clientId')
        console.log(cart.productsId)
        console.lo
        res.render('cart',{cart})
        
    } catch (error) {
        console.log(error.message)
        
    }
}


module.exports = {
    addToCart,
    cartView
}
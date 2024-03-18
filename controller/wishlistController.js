const wishlistDb = require('../model/wishlistDb')
const productDb =require('../model/productDb')
const cartDb = require('../model/cartDb')
//VIEW THE WISHLIST
 const viewWishlist = async (req,res)=>{
    try {
        const {user_id}=req.session
        let cartCount =0
        const dataWishlist = await wishlistDb.findOne({clientId:user_id}).populate({path:'products.productId',mondel:'product'})
        if(dataWishlist){
            console.log("qqqqqqqq")

            const cart = await cartDb.findOne({clientId:user_id})
            console.log("djksdk")
            if(cart){

                cartCount= cart.products.length
            }
        }
        
       return res.render("wishlist",{dataWishlist,cartCount})
    } catch (error) {
        console.log(error.message)
    }
 }

 //ADD TO WISHLIST
 const addToWishlist = async (req,res)=>{
    try {
        const {productId}=req.body
        
        const {user_id}=req.session
        const productToData = await productDb.findOne({_id:productId})
        const checkInWishlist = await wishlistDb.findOne({clientId:user_id,products:{$elemMatch:{productId}}})
        if(!checkInWishlist){
            const checkWishlist = await wishlistDb.findOne({clientId:user_id})
            if(checkWishlist){
                console.log(checkWishlist,"rgjsdjkhnsdfjnsejkdfnwsjdfnjdfkmndjsfkmnsfjnfjs")
                const initialLength = checkWishlist.products.length
                checkWishlist.products.push({
                    productId,
                    image:productToData.image[0]
                })
                const finalLength = checkWishlist.products.length;
                if(finalLength>initialLength){
                    await checkWishlist.save()
                    res.send({status:true})
                }

            }else{

                const result = new wishlistDb({
                    clientId:user_id,
                    products:[{
                        productId,
                        image:productToData.image[0]
                    }]
                })
                const newWishlist = await result.save()
                if(newWishlist){
                    res.send({status:true})
                }
            }
        }else{
            res.send({status:false})
        }
            
    } catch (error) {
        console.log(error.message)
        
    }
 }

 //PRODUCT REMOVE FROM WISHLIST
 const removefromWishlist = async (req,res)=>{
    try {
        const {productId}=req.body
        const {user_id}=req.session
        const removeProduct = await wishlistDb.findOneAndUpdate({clientId:user_id},{$pull:{products:{productId}}})
        if(removeProduct){
            res.send({status:true})
        }
        
    } catch (error) {
        console.log(errror.message)
        
    }
 }

module.exports={
    viewWishlist,
    addToWishlist,
    removefromWishlist
}
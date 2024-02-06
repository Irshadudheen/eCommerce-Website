
const addToCart = async (req,res)=>{
    try {
        res.render('cart')
        
    } catch (error) {
        console.log(error.message)
        
    }
}



module.exports = {
    addToCart
}
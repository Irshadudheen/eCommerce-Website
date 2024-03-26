const productDb = require('../model/productDb')
const cartDb = require('../model/cartDb')
const clientDb = require('../model/clientDb')
const orderDb = require('../model/orderDb')
const addressDb = require('../model/addressDb')
const Razorpay = require('razorpay')
const couponDb = require('../model/couponDb')
const offerDb = require('../model/offerDb')
const walletDb = require('../model/walletDb')

//RAZORPAY PAYMENT METHOD
const instance = new Razorpay({
    key_id:process.env.key_id,
    key_secret:process.env.key_secret
})

const addToCart = async (req, res) => {
    try {
        
        const { id, quantity } = req.body
        const products={productId:id,quantity}
        const clientId = req.session.user_id
        const checkTheProduct = await cartDb.findOne({ clientId})
        const checkTheCartProduct = checkTheProduct?.products.some(product=>product.productId==id)
        const productToCart = await productDb.findOne({ _id: id }).populate('categoryid')
        
        if (!checkTheCartProduct) {
            const checkTheCart = await cartDb.findOne({ clientId })
            if (checkTheCart) {
                const initialLength = checkTheCart.products.length;
                checkTheCart.products.push(products)
                const finalLength = checkTheCart.products.length;
                if (finalLength > initialLength) {
                    await checkTheCart.save(); // Save the updated cart
                    res.send({ status: true });
                } else {
                    console.log("Product was not pushed to the cart.");
                    res.send({ status: false });
                }


            } else {
                const newCart = new cartDb({
                    clientId,
                    products: [products]
 })
                const newcart = await newCart.save()
                if (newcart) {
                    res.send({ status: true })
                }
            }

        } else {
            res.send({ status: false })
        }

    } catch (error) {
        console.log(error.message)

    }
}
//CARTVIEW
const cartView = async (req, res) => {
    try {
        const { user_id } = req.session
        console.log(req.body,433434343434)
        console.log(req.query)
        const {hidden}=req.query
        const offer = await offerDb.find()
        const cart = await cartDb.findOne({ clientId: user_id }).populate({
            path: 'products.productId',
            model: 'product',
            match: { status: true }
        })
        const filteredCart = cart?.products.filter(product => product.productId !== null)
        if(cart){

            cart.products=filteredCart
        }
        console.log("dsfijfiosdk")
        console.log("sdkdsckjdmckm")
        // const errmsg = req.flash("err");
        if (cart) {
            cart.products.forEach(product=>{
                product.productPrice=product.productId.price
                product.totalPrice=product.productPrice*product.quantity;
                offer.forEach(ele=>{
              
                    if(ele.categoryId&&product.productId.categoryid.toString()==ele.categoryId.toString()){
                   
                applyOffer(product,ele.amount)

        } if(ele.productId && product.productId._id.toString()==ele. productId.toString() ){
            applyOffer(product,ele.amount)

        }})
        function applyOffer(product,amount){
            console.log(product.productPrice,'q')
            console.log(product,amount,"rfidokreoeruofidkucjikwjkwtfuicjmt4sdijt4mfsuidjwduitjmuit4ocdjmji")
         
            const discountedPrice=product.totalPrice-(product.totalPrice*amount)/100
            const discountedPriceIn=product.productPrice-(product.productPrice*amount)/100
            console.log(discountedPrice)
            product.totalPrice=Math.round(Math.min(product.totalPrice,discountedPrice))
            product.productPrice=Math.round(Math.min(product.productPrice,discountedPriceIn))
            console.log(product.totalPrice)
           
        }
    })

            const totalPrice = cart.products.reduce((total, product) => {
                return total + product.totalPrice
                
            }, 0)
            
            res.render('cart', { cart, totalPrice})
            
        } else {
            console.log("jsdiokljdsilkjrfsdjkdsjkm")

            res.render("cart",{cart,totalPrice:0})
        }
        // console.log(cart.productsId)
        // console.log("---------------------------------------------------------",cart.length)
        // const priceTotal = cart.priceTotal


        // res.render('cart',{cart,priceTotal})

    } catch (error) {
        console.log(error.message)

    }
}
//REMOVE CART
const removeCart = async (req, res) => {
    try {
        const { _id, cart_id } = req.body
        const removeCart = await cartDb.findByIdAndUpdate({ _id: cart_id }, { $pull: { products: { productId: _id } } })
        console.log(_id)
        console.log(removeCart)
        
    
        
        if(removeCart.products.length==1){
            console.log("aaa")
            await cartDb.deleteOne({_id:cart_id})
            res.send({status:true,cartdelete:true})
        }else{
            const offer = await offerDb.find()
            const newCart = await cartDb.findOne({_id:cart_id}).populate("products.productId")
            newCart.products.forEach(product=>{
                product.productPrice=product.productId.price
                product.totalPrice=product.productPrice*product.quantity;
                offer.forEach(ele=>{
              
                    if(ele.categoryId&&product.productId.categoryid.toString()==ele.categoryId.toString()){
                   
                applyOffer(product,ele.amount)

        } if(ele.productId && product.productId._id.toString()==ele. productId.toString() ){
            applyOffer(product,ele.amount)

        }})
        function applyOffer(product,amount){
            console.log(product.productPrice,'q')
            console.log(product,amount,"rfidokreoeruofidkucjikwjkwtfuicjmt4sdijt4mfsuidjwduitjmuit4ocdjmji")
         
            const discountedPrice=product.totalPrice-(product.totalPrice*amount)/100
            const discountedPriceIn=product.productPrice-(product.productPrice*amount)/100
            console.log(discountedPrice)
            product.totalPrice=Math.round(Math.min(product.totalPrice,discountedPrice))
            product.productPrice=Math.round(Math.min(product.productPrice,discountedPriceIn))
            console.log(product.totalPrice)
           
        }
    })
    const totalPrice = newCart.products.reduce((total, product) => {
        return total + product.totalPrice
        
    }, 0)

            res.send({ status: true ,totalPrice})
        }
       
        

    } catch (error) {
        console.log(error.message)

    }
}

//TOTALPRICE
const totalPrice = async (req, res) => {
    try {
        const { p_quantity, id } = req.body
        const { user_id } = req.session
        console.log(id, "productid")
        const existingCart = await cartDb.findOne({ clientId: user_id })
        const productToUpdate = existingCart.products.find((p) =>  p.productId.equals(id))
        if (productToUpdate) {
            productToUpdate.quantity = p_quantity
            const updatedCart = await existingCart.save()
           
          
            const offer = await offerDb.find()
            const newCart = await cartDb.findOne({clientId: user_id }).populate({path:'products.productId',model:'product'})
            console.log(newCart)
            newCart.products.forEach(product=>{
                product.totalPrice=product.productId.price*product.quantity
                offer.forEach(ele=>{
                    if(ele.categoryId&&product.productId.categoryid.toString()==ele.categoryId.toString()){
                        applyOffer(product,ele.amount)
                    }
              
                    if(ele.productId&&product.productId._id.toString()==ele.productId.toString()){
                     
                        applyOffer(product,ele.amount)
                    }
                })
                function applyOffer(product,amount){
                    const discountedPrice=product.totalPrice-(product.totalPrice*amount)/100
                    product.totalPrice=Math.round(Math.min(product.totalPrice,discountedPrice))


                }

            })
            const updatedTotalPrice = productToUpdate.totalPrice;
            //product total
            const totalPricetotal = existingCart.products.reduce((total, product) => {
                return total + product.totalPrice

            })
            if (totalPricetotal) {
                //cart total
                const totalPrice = newCart.products.reduce((total, product) => {
                    return total + product.totalPrice

                }, 0)
                

                res.send({ totalPrice })
            }



        }




    } catch (error) {
        console.log(error.message)

    }
}


//CHECKOUT
const checkOut = async (req, res) => {
    try {
        const {user_id}=req.session
        const address = await addressDb.find({ clientId:user_id}).populate('clientId')
        const cart = await cartDb.findOne({clientId:user_id}).populate({path:'products.productId',model:'product'})
        const offer = await offerDb.find()
        cart.products.forEach(product=>{
            product.totalPrice=product.productId.price*product.quantity
            offer.forEach(ele=>{
                if(ele.categoryId&&product.productId.categoryid.toString()==ele.categoryId.toString()){
                    applyOffer(product,ele.amount)
                }
                if(ele.productId&&product.productId._id.toString()==ele.productId.toString()){
                 
                    applyOffer(product,ele.amount)
                }
            })
            function applyOffer(product,amount){
                const discountedPrice=product.totalPrice-(product.totalPrice*amount)/100
                product.totalPrice=Math.round(Math.min(product.totalPrice,discountedPrice))
            }
        })
        console.log(cart)
        console.log(1)
        const cartTotal= cart.products.reduce((total,product)=>{
            return total+product.totalPrice
        },0)
        console.log(cartTotal)
        res.render('checkOut', { totalPrice:cartTotal, address,cart})
    } catch (error) {
        console.log(error.message)

    }
}

//placeOrder
const placeOrder = async (req, res) => {
    try {
        const { user_id } = req.session
        const {coupon}=req?.session
        let dectription="the full price"
        if(coupon){
            const addUserId = await couponDb.findOneAndUpdate({_id:coupon},{$push:{users:{clientId:user_id}}},{ new: true })
            dectription="the offer price by  Coupon"
        }
        const address = await addressDb.findOne({ _id: req.body.address_id })
        const { paymentMethod, totalPrice } = req.body
        if(paymentMethod =='Wallet'){
            const Wallet = await walletDb.findOne({clientId:user_id})
            if(totalPrice>Wallet.balance){
               return res.send({Wallet:false})
            }
        }
        const cart = await cartDb.findOne({ clientId: user_id })
        const products = await Promise.all(cart.products.map(async (cartProduct) => {
            const productDetails = await productDb.findById(cartProduct.productId);
            productDetails.quantity -= cartProduct.quantity;
            const decreserQuantity = await productDetails.save()
            const offer = await offerDb.find()
            offer.forEach(ele=>{
                if(ele.categoryId&&ele.categoryId.toString()===productDetails.categoryid.toString()){
                    applyOffer(productDetails,ele.amount)
                }
                if(ele.productId&&ele.productId.toString()===productDetails._id.toString()){
                    applyOffer(productDetails,ele.amount)
                }
            })
            function applyOffer(product,amount){
             
                const discountedPrice=product.price-(product.price*amount)/100
                product.price=Math.round(Math.min(product.price,discountedPrice))
            }
            let totalPrice=cartProduct.quantity*productDetails.price
            console.log('total:',totalPrice)
            if(coupon){
                const coupondata = await couponDb.findOne({_id:coupon})
                 totalPrice =totalPrice-(productDetails.price*coupondata.amount) /100
                 console.log(coupondata.amount)
            }
            console.log('coupon:',totalPrice)
           
            
           
            return {
                productId: cartProduct.productId,
                name: productDetails.name,
                price: productDetails.price,
                quantity: cartProduct.quantity,
                totalPrice,
                image: cartProduct.image,
            };
        }))
        const timestamp = Date.now();
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleString();
        const orderData = new orderDb({
            clientId: user_id,
            addressId:address,
            products: products,
            totalPrice,
            paymentMethod,
            dectription,
            date: formattedDate,
            payment: totalPrice,
        })
        const dataOrder = await orderData.save()
        if (paymentMethod =="COD") {
            const deleteCart = await cartDb.deleteOne({ clientId: req.session.user_id })
            if (deleteCart) {
                res.send({ status: true })
            } else {
                res.send({ status: false })
            }
        }else if(paymentMethod =="Razorpay"){
            const deleteCart = await cartDb.deleteOne({ clientId: req.session.user_id })
        if(deleteCart){
    const razorpayOrder = await instance.orders.create({
        amount:totalPrice*100 ,
        currency:'INR',
        receipt:dataOrder._id.toString()
    })
    if(razorpayOrder){
        req.session.OrderId=orderData._id
        res.send({status:"razorpayOrder",razorpayOrder})
    }
}
}else if(paymentMethod =='Wallet'){
     await cartDb.deleteOne({ clientId: req.session.user_id })
    const wallet = await walletDb.findOneAndUpdate({clientId: req.session.user_id},{$inc:{balance:-totalPrice},$push:{history:{type:'depit',amount:totalPrice,description:'the order placed'}}})
    if(wallet){
        
        req.session.OrderId=orderData._id
        res.send({Wallet:true})
    }
}
    }
    catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

const tryAgainRazorpay = async(req,res)=>{
    try {
        console.log(req.body)
        const{ productPrice,orderId,producId}=req.body
        const razorpayOrder = await instance.orders.create({
            amount:productPrice*100 ,
            currency:'INR',
            receipt:orderId.toString()
        })
        if(razorpayOrder){
            req.session.producId=producId
            res.send({status:"razorpayOrder",razorpayOrder})
        }
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

module.exports = {
    addToCart,
    cartView,
    removeCart,
    totalPrice,
    checkOut,
    placeOrder,
    tryAgainRazorpay
}
const orderDb = require("../model/orderDb")
const productDb = require('../model/productDb')
const walletDb = require("../model/walletDb")

//DELETE THE ORDER
const deleteTheOrder = async (req, res) => {
    try {
        const { product_id, order_id} = req.body
        console.log(product_id, order_id)
        const removeTheOrder = await orderDb.findByIdAndUpdate({ _id: order_id }, { $pull: { products: { productId: product_id } } })
        console.log(removeTheOrder, "____________________________________________________________________-")
        if (removeTheOrder) {
            res.send({ status: true })
        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}


const orderlist = async (req, res) => {
    try {
        console.log(req.query)
        const { orderId } = req.query
        const orderData = await orderDb.findOne({ _id: orderId }).populate('clientId').populate({
            path: 'products.productId',
            model: 'product'

        }).populate("addressId")

        console.log(orderData.products)
        res.render('viewEachOrder', { orderData })

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

const updateSatus = async (req, res) => {
    try {
        const { option, order_id } = req.body
        const update = await orderDb.findByIdAndUpdate({ _id: order_id }, { $set: { orderStatus: option } })
        if (update) {
            res.send({ status: true })
        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

//VIEW EACH ORDER IN USER
const orderEachView = async (req,res)=>{
    try {
        const {productId,OrderId}= req.query
        const{user_id}=req.session
       
        const orderData = await orderDb.findOne( {_id:OrderId} ).populate("clientId").populate({path:'products.productId',model:'product'})
       const orderPrdoct= orderData.products.find(product=>product.productId.toString()==productId.toString())

          
        res.render("eachOrder",{orderData,productId})
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
        
    }
}

//INVOICE TO ADMIN SIDE 
const invoice = async (req,res)=>{
    try {
        const order  = await orderDb.find().populate({path:"products.productId",model:"product"}).populate("clientId")
        res.render('invoice',{order})
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}


//
const updateSatusOfOrderProduct = async (req,res)=>{
    try {
        const {option,product_id}=req.body
        const UpdateproductStatus = await  orderDb.findOneAndUpdate({"products._id":product_id},{$set:{"products.$.productStatus":option}})
        if(UpdateproductStatus){
            res.send({status:true})
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
        
    }
}

const cancelTheOrder = async(req,res)=>{
    try {
        console.log(req.body)
       const{ producId,orderId}=req.body
       const {user_id}=req.session
       const update = await orderDb.findOneAndUpdate({'products._id': producId},{$set:{'products.$.productStatus':"Cancel"}},{new:true})
        if(update){
            const updateWallet =await walletDb.findOneAndUpdate({clientId:user_id},{$inc:{balance:update.products[0].totalPrice}}) 
            if(updateWallet){
                res.send({status:true})
            }
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
        
    }
}

//succesPaymentRazorpay
const succesPayment = async(req,res)=>{
    try {
const {OrderId}=req.session
        const update = await orderDb.findOneAndUpdate({_id:OrderId},{$set:{orderStatus:'placed'}})
      const data =   update.products.forEach(product=>product.productStatus='placed')
       await update.save()
        
    } catch (error) {
        console.log(error.message)
        
    }
}

const returnOrderProduct = async(req,res)=>{
    try {
        
        console.log(req.body)
        const {orderId,producId}=req.body
        const updateProductStatus = await orderDb.findOneAndUpdate({'products._id':producId},{$set:{'products.$.productStatus':'Return'}},{new:true})
        console.log(updateProductStatus)
        if(updateProductStatus){
            res.send({status:true})
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
        
    }
}

//succesPaymentRazorpay
const succesPaymentRazorpay = async (req,res)=>{
    try {
        console.log(req.session.producId)
        const update = await orderDb.findOneAndUpdate({'products._id':req.session.producId},{$set:{'products.$.productStatus':'placed'}},{new:true})
        console.log(update)
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

module.exports = {
    deleteTheOrder,
    orderlist,
    updateSatus,
    orderEachView,
    invoice,
    updateSatusOfOrderProduct,
    cancelTheOrder,
    succesPayment,
    returnOrderProduct,
    succesPaymentRazorpay
}
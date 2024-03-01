const orderDb = require("../model/orderDb")
const productDb = require('../model/productDb')
const walletDb = require("../model/walletDb")

//DELETE THE ORDER
const delteTheOrder = async (req, res) => {
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

    }
}

//VIEW EACH ORDER IN USER
const orderEachView = async (req,res)=>{
    try {
        const {productId,OrderId}= req.query
        const{user_id}=req.session
        console.log(productId,122121)
       
        const orderData = await orderDb.findOne( {_id:OrderId} ).populate('addressId').populate("clientId").populate({path:'products.productId',model:'product'})
       const orderPrdoct= orderData.products.find(product=>product.productId.toString()==productId.toString())
        console.log(orderPrdoct)

          
        console.log(req.query)
console.log(orderData,1111111111111111111111111111111111111111111111111111)
        res.render("eachOrder",{orderData,productId})
    } catch (error) {
        console.log(error.message)
        
    }
}

//INVOICE TO ADMIN SIDE 
const invoice = async (req,res)=>{
    try {
        const order  = await orderDb.find().populate({path:"products.productId",model:"product"}).populate("clientId")
        res.render('invoice',{order})
        
    } catch (error) {
        console.log(error.message)
        
    }
}


//
const updateSatusOfOrderProduct = async (req,res)=>{
    try {
        console.log(req.body)
        const {option,product_id}=req.body
        console.log(option,product_id)
        const UpdateproductStatus = await  orderDb.findOneAndUpdate({"products._id":product_id},{$set:{"products.$.productStatus":option}})
        if(UpdateproductStatus){
            res.send({status:true})
        }
    } catch (error) {
        console.log(error.message)
        
    }
}

const cancelTheOrder = async(req,res)=>{
    try {
        console.log(req.body)
       const{ producId,orderId}=req.body
       const {user_id}=req.session
       console.log(req.session)
       const update = await orderDb.findOneAndUpdate({'products._id': producId},{$set:{'products.$.productStatus':"Cancel"}},{new:true})
        console.log(update)
        if(update){
            console.log(update.products[0].totalPrice)
            const updateWallet =await walletDb.findOneAndUpdate({clientId:user_id},{$inc:{balance:update.products[0].totalPrice}}) 
            console.log(updateWallet)
        }
    } catch (error) {
        console.log(error.message)
        
    }
}

module.exports = {
    delteTheOrder,
    orderlist,
    updateSatus,
    orderEachView,
    invoice,
    updateSatusOfOrderProduct,
    cancelTheOrder
}
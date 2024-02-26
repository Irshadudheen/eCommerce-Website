const orderDb = require("../model/orderDb")
const productDb = require('../model/productDb')

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
        const {productId,cartId}= req.query
        const{user_id}=req.session
        console.log(cartId,productId,111234234)
        const orderData = await orderDb.findOne({ products: { $elemMatch: { productId: productId } } })
          
        console.log(req.query)
console.log(orderData,1111111111111111111111111111111111111111111111111111)
        res.render("eachOrder",{orderData})
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

module.exports = {
    delteTheOrder,
    orderlist,
    updateSatus,
    orderEachView,
    invoice,
    updateSatusOfOrderProduct
}
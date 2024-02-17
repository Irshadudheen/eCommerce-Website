const orderDb = require("../model/orderDb")

const delteTheOrder = async (req, res) => {
    try {
        const { product_id, order_id } = req.body
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
        const { productId, orderId } = req.query
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

module.exports = {
    delteTheOrder,
    orderlist,
    updateSatus
}
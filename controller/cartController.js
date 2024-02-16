const productDb = require('../model/productDb')
const cartDb = require('../model/cartDb')
const clientDb = require('../model/clientDb')
const orderDb = require('../model/orderDb')
const addressDb = require('../model/addressDb')
const addToCart = async (req, res) => {
    try {
        console.log(req.query)

        const { id, quantity } = req.body
        const clientId = req.session.user_id
        const checkTheProduct = await cartDb.findOne({ products: { $elemMatch: { productId: id } } })
        const productToCart = await productDb.findOne({ _id: id }).populate('categoryid')
        console.log(checkTheProduct)
        if (!checkTheProduct) {
            const checkTheCart = await cartDb.findOne({ clientId })
            if (checkTheCart) {
                const initialLength = checkTheCart.products.length;
                

                checkTheCart.products.push({
                    productId: id,
                    quantity,
                    productPrice: productToCart.price,
                    totalPrice: quantity * productToCart.price,
                    image: productToCart.image[0]
                })
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
                    products: [{
                        productId: id,
                        productPrice: productToCart.price,
                        quantity,
                        totalPrice: productToCart.price * quantity,
                        image: productToCart.image[0],
                    }
                    ]


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


        const cart = await cartDb.findOne({ clientId: user_id }).populate({
            path: 'products.productId',
            model: 'product'
        })
        // const errmsg = req.flash("err");
        if (cart) {
            const totalPrice = cart.products.reduce((total, product) => {
                return total + product.totalPrice

            }, 0)
            console.log(cart.products.length, "++++++++++++++++++++++++++++++++++=")
            console.log(cart.products[0].productId.quantity)
            res.render('cart', { cart, totalPrice })

        } else {

            res.render("cart", { cart })
        }
        // console.log(cart.productsId)
        // console.log("---------------------------------------------------------",cart.length)
        // const priceTotal = cart.priceTotal


        // res.render('cart',{cart,priceTotal})

    } catch (error) {
        console.log(error.message)

    }
}
//REMOVE CARD
const removeCard = async (req, res) => {
    try {
        const { _id, cart_id } = req.body
        const removeCard = await cartDb.findByIdAndUpdate({ _id: cart_id }, { $pull: { products: { productId: _id } } })
        console.log(_id)
        console.log(cart_id, "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
        if (removeCard) {
            res.send({ status: true })
        }

    } catch (error) {
        console.log(error.message)

    }
}

//TOTALPRICE
const totalPrice = async (req, res) => {
    try {
        const { p_quantity, cart_id, id } = req.body
        const { user_id } = req.session
        console.log(id, "productid")
        const existingCart = await cartDb.findById({ _id: cart_id })
        const productToUpdate = existingCart.products.find((p) => {

            return p.productId.equals(id)

        })
        if (productToUpdate) {

            productToUpdate.quantity = p_quantity
            productToUpdate.totalPrice = p_quantity * productToUpdate.productPrice
            const updatedCart = await existingCart.save()
            const updatedTotalPrice = productToUpdate.totalPrice;
            //product total
            const totalPricetotal = existingCart.products.reduce((total, product) => {
                return total + product.totalPrice

            })
            if (totalPricetotal) {
                //cart total
                const totalPrice = updatedCart.products.reduce((total, product) => {
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
        const { totalPrice } = req.query

        const address = await addressDb.find({ clientId: req.session.user_id })
        res.render('checkOut', { totalPrice, address })

    } catch (error) {
        console.log(error.message)

    }
}

//PLACEHOLDER
const placeholder = async (req, res) => {
    try {
        const { user_id } = req.session
        const address = await addressDb.findOne({ _id: req.body.address })
        console.log(user_id,address,"address and user_id")


        const { paymentMethod, totalPrice } = req.body
        const cart = await cartDb.findOne({ clientId: user_id })

        const products = await Promise.all(cart.products.map(async (cartProduct) => {
            console.log(cartProduct.totalPrice,"_______________________________________++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

            const productDetails = await productDb.findById(cartProduct.productId);
            productDetails.quantity -= cartProduct.quantity;
            const decreserQuantity = await productDetails.save()

            return {
                productId: cartProduct.productId,
                name: productDetails.name,
                price: productDetails.price,
                quantity: cartProduct.quantity,

                totalPrice: cartProduct.totalPrice,
                image: cartProduct.image,

            };
        }))
        console.log(products)
        const timestamp = Date.now();
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleString();

        console.log(formattedDate);
        const orderData = new orderDb({
            clientId: user_id,
            products: products,
            totalPrice,
            addressId: req.body.pincodeId,
            date: formattedDate,
            payment: totalPrice,



        })
        const dataOrder = await orderData.save()





        if (paymentMethod) {



            const deleteCart = await cartDb.deleteOne({ clientId: req.session.user_id })
            if (deleteCart) {
                res.send({ status: true })
            } else {
                res.send({ status: false })
            }

        }
    }








    catch (error) {
        console.log(error.message)

    }
}

module.exports = {
    addToCart,
    cartView,
    removeCard,
    totalPrice,
    checkOut,
    placeholder
}
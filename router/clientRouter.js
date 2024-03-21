const express = require('express');
const clientRouter = express();
const clientController = require('../controller/clientController');
const productController = require('../controller/productController')
const authantication = require('../middleware/authantication')
const cartController = require('../controller/cartController')
const addressController = require('../controller/addressController')
const orderController = require('../controller/orderController')
const wishlistController =require('../controller/wishlistController')
const couponController = require('../controller/couponController')
const offerController = require('../controller/offerController')
const path = require('path')

clientRouter.set('views','./views/client')


clientRouter.use(express.static(path.join(__dirname, '../public')))
clientRouter.use(express.static(path.join(__dirname, '../public/client')))

//register
clientRouter.post('/register', clientController.signUpPost)



clientRouter.get('/', authantication.logout, clientController.login)
clientRouter.post('/', clientController.loginPost)
clientRouter.get('/otpPage',clientController.otpPage)
//

clientRouter.get('/dashboard', clientController.clientDashboard)
clientRouter.get('/logout', authantication.login, clientController.logOut)
clientRouter.post('/otpSubmit', clientController.otpSubmit)


clientRouter.get('/product', productController.Clientproduct)
clientRouter.get('/eachproduct', productController.eachproduct)
clientRouter.post('/removeCard', authantication.login, cartController.removeCard)
clientRouter.get('/profile', authantication.login, clientController.profile)
clientRouter.get('/resendOtp', authantication.logout, clientController.resendOtp)
clientRouter.get('/forgotPassword', authantication.logout, clientController.forgotPassword)
clientRouter.get('/register', authantication.logout, clientController.register)
clientRouter.get('/cartView', authantication.login, cartController.cartView)
clientRouter.get('/wishlist',authantication.login,wishlistController.viewWishlist)
clientRouter.post('/addnewaddress', addressController.addnewaddress)
clientRouter.post('/addToCart', authantication.login, cartController.addToCart)
clientRouter.post('/deleteTheAddress', addressController.deleteTheAddress)
clientRouter.post('/forgotPassword', clientController.forgotPasswordSubmit)
clientRouter.post('/otpSubmitForgot', clientController.otpSubmitForgot)
clientRouter.post('/passwordUpdate', clientController.passwordUpdate)
clientRouter.post('/editProfile', addressController.editProfile)
clientRouter.post('/totalPrice', cartController.totalPrice)
clientRouter.get('/checkOut', authantication.login, cartController.checkOut)
clientRouter.post('/placeOrder', cartController.placeholder)
clientRouter.post('/delteTheOrder', orderController.delteTheOrder)
clientRouter.post('/addToWishlist',wishlistController.addToWishlist)
clientRouter.post('/removefromWishlist',wishlistController.removefromWishlist)
clientRouter.get('/orderEachView',authantication.login,orderController.orderEachView)
clientRouter.post('/checkCopon',couponController.checkCopon)
clientRouter.get('/forgotOtpPage',clientController.forgotOtpPage)
clientRouter.get('/deal',authantication.login,offerController.deal)
clientRouter.post('/cancelTheOrder',orderController.cancelTheOrder)
clientRouter.post('/succesPayment',orderController.succesPayment)
clientRouter.post('/returnOrderProduct',orderController.returnOrderProduct)
clientRouter.post('/CheckUserName',clientController.checkUserName)
clientRouter.post('/tryAgainPaymentRazorpay',cartController.tryAgainRazorpay)
clientRouter.post('/succesPaymentRazorpay',orderController.succesPaymentRazorpay)
module.exports = clientRouter;
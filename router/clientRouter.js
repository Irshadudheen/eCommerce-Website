const express = require('express');
const clientRouter = express();
const {checkUserName,clientDashboard,errorPage,forgotOtpPage,forgotPassword,forgotPasswordSubmit,logOut,login,loginPost,otpPage,otpSubmit,otpSubmitForgot,passwordUpdate,profile,register,resendOtp,signUpPost} = require('../controller/clientController');
const {clientProduct,eachProduct} = require('../controller/productController')
const {logIn,logout} = require('../middleware/authantication')
const {addToCart,cartView,checkOut,placeOrder,removeCart,totalPrice,tryAgainRazorpay} = require('../controller/cartController')
const {addNewAddress,deleteTheAddress,editProfile} = require('../controller/addressController')
const {cancelTheOrder,deleteTheOrder,orderEachView,returnOrderProduct,succesPayment,succesPaymentRazorpay} = require('../controller/orderController')
const {addToWishlist,removeFromWishlist,viewWishlist} =require('../controller/wishlistController')
const {checkCoupon} = require('../controller/couponController')
const {deal} = require('../controller/offerController')
const path = require('path')

clientRouter.set('views','./views/client')


clientRouter.use(express.static(path.join(__dirname, '../public')))
clientRouter.use(express.static(path.join(__dirname, '../public/client')))

//register
clientRouter.post('/register', signUpPost)



clientRouter.get('/', logout, login)
clientRouter.post('/', loginPost)
clientRouter.get('/otpPage',otpPage)
//

clientRouter.get('/dashboard', clientDashboard)
clientRouter.get('/logout', logIn, logOut)
clientRouter.post('/otpSubmit', otpSubmit)


clientRouter.get('/product', clientProduct)
clientRouter.get('/eachproduct', eachProduct)
clientRouter.post('/removeCard', removeCart)
clientRouter.get('/profile', logIn, profile)
clientRouter.get('/resendOtp', logout, resendOtp)
clientRouter.get('/forgotPassword', logout, forgotPassword)
clientRouter.get('/register', logout, register)
clientRouter.get('/cartView', logIn, cartView)
clientRouter.get('/wishlist',logIn,viewWishlist)
clientRouter.post('/addnewaddress', addNewAddress)
clientRouter.post('/addToCart', logIn, addToCart)
clientRouter.post('/deleteTheAddress', deleteTheAddress)
clientRouter.post('/forgotPassword', forgotPasswordSubmit)
clientRouter.post('/otpSubmitForgot', otpSubmitForgot)
clientRouter.post('/passwordUpdate', passwordUpdate)
clientRouter.post('/editProfile', editProfile)
clientRouter.post('/totalPrice', totalPrice)
clientRouter.get('/checkOut', logIn, checkOut)
clientRouter.post('/placeOrder', placeOrder)
clientRouter.post('/delteTheOrder', deleteTheOrder)
clientRouter.post('/addToWishlist',addToWishlist)
clientRouter.post('/removefromWishlist',removeFromWishlist)
clientRouter.get('/orderEachView',logIn,orderEachView)
clientRouter.post('/checkCopon',checkCoupon)
clientRouter.get('/forgotOtpPage',forgotOtpPage)
clientRouter.get('/deal',logIn,deal)
clientRouter.post('/cancelTheOrder',cancelTheOrder)
clientRouter.post('/succesPayment',succesPayment)
clientRouter.post('/returnOrderProduct',returnOrderProduct)
clientRouter.post('/CheckUserName',checkUserName)
clientRouter.post('/tryAgainPaymentRazorpay',tryAgainRazorpay)
clientRouter.post('/succesPaymentRazorpay',succesPaymentRazorpay)
clientRouter.get('/404',errorPage)
clientRouter.get('*',(req,res)=>res.status(404).redirect('/404'))
module.exports = clientRouter;
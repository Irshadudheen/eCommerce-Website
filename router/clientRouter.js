const express = require('express');
const clientRouter = express();
const clientController = require('../controller/clientController');
const productController = require('../controller/productController')
const authantication =require('../middleware/authantication')
const cartController = require('../controller/cartController')
const path =require('path')

clientRouter.set('views','./views/client')


clientRouter.use(express.static(path.join(__dirname,'../public')))
clientRouter.use(express.static(path.join(__dirname,'../public/client')))

//register
clientRouter.post('/register',clientController.signUpPost)



clientRouter.get('/',authantication.logout,clientController.login)
clientRouter.post('/',clientController.loginPost)

//

clientRouter.get('/dashboard',authantication.login,clientController.clientDashboard)
clientRouter.get('/logout',authantication.login,clientController.logout)
clientRouter.post('/otpSubmit',clientController.otpSubmit)


clientRouter.get('/product',authantication.login,productController.Clientproduct)
clientRouter.get('/eachproduct',authantication.login,productController.eachproduct)

clientRouter.get('/profile',authantication.login,clientController.profile)
clientRouter.get('/resendOtp',authantication.logout,clientController.resendOtp)
clientRouter.get('/forgotPassword',authantication.logout,clientController.forgotPassword)
clientRouter.get('/cartView',authantication.login,cartController.cartView)
clientRouter.post('/addToCart',authantication.login,cartController.addToCart)
clientRouter.post('/forgotPassword',clientController.forgotPasswordSubmit)
clientRouter.post('/otpSubmitForgot',clientController.otpSubmitForgot)
clientRouter.post('/passwordUpdate',clientController.passwordUpdate)
clientRouter.post('/removeCard',cartController.removeCard)
module.exports=clientRouter;
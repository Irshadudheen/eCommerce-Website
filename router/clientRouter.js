const express = require('express');
const clientRouter = express();
const clientController = require('../controller/clientController');
const productController = require('../controller/productController')
const authantication =require('../middleware/authantication')
const path =require('path')

clientRouter.set('views','./views/client')


// clientRouter.use(express.static(path.join(__dirname,'../public')))
clientRouter.use(express.static(path.join(__dirname,'../public/client')))

//register
clientRouter.post('/register',clientController.signUpPost)


clientRouter.get('/',authantication.logout,clientController.login)
clientRouter.post('/',clientController.loginPost)

//

clientRouter.get('/dashboard',authantication.login,clientController.clientDashboard)
clientRouter.get('/logout',authantication.login,clientController.logout)
clientRouter.post('/otpSubmit',clientController.otpSubmit)


clientRouter.get('/product',authantication.login,clientController.product)
clientRouter.get('/eachproduct',authantication.login,productController.eachproduct)



module.exports=clientRouter;
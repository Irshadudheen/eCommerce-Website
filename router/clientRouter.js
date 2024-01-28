const express = require('express');
const clientRouter = express();
const clientController = require('../controller/clientController');
const authantication =require('../middleware/authantication')


clientRouter.set('views','./views/client')



//register
clientRouter.post('/register',clientController.signUpPost)


clientRouter.get('/',authantication.logout,clientController.login)
clientRouter.post('/',clientController.loginPost)

//

clientRouter.get('/dashboard',authantication.login,clientController.clientDashboard)
clientRouter.get('/logout',authantication.login,clientController.logout)





















module.exports=clientRouter;
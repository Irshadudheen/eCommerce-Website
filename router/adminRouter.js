const express= require('express')
const adminRouter = express()
const adminController = require('../controller/adminController')
const adminProductController = require('../controller/productController')
const authantication = require('../middleware/authantication')

const path = require('path')
adminRouter.set('views','./views/admin')
// adminRouter.set('views','./views/client')
// adminRouter.set('views','./views/layout')
adminRouter.use(express.static(path.join(__dirname,'../public/admin')))


adminRouter.get('/adminWelcome',authantication.isadminlogin,adminController.adminDashboard)
adminRouter.get('/productAdmin',authantication.isadminlogin,adminProductController.productAdmin)
adminRouter.get('/logoutadmin',authantication.isadminlogin,adminController.logoutadmin)
adminRouter.get('/clientview',authantication.isadminlogin,adminController.clientview)
adminRouter.get('/editUser',authantication.isadminlogin,adminController.editUser)
adminRouter.post('/updateClient',adminController.updateClient)
adminRouter.post('/deleteClient',adminController.deleteClient)
module.exports=adminRouter;

const express= require('express')
const adminRouter = express()
const adminController = require('../controller/adminController')
const authantication = require('../middleware/authantication')

adminRouter.set('views','./views/admin')


adminRouter.get('/adminWelcome',authantication.isadminlogin,adminController.adminDashboard)
adminRouter.get('/logoutadmin',authantication.isadminlogin,adminController.logoutadmin)



module.exports=adminRouter;

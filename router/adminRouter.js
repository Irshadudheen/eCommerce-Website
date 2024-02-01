const express= require('express')
const adminRouter = express()
const adminController = require('../controller/adminController')
const adminProductController = require('../controller/productController')
const adminCategoryController = require('../controller/categoryController')
const authantication = require('../middleware/authantication')

const multer = require('multer')
const path = require('path')

adminRouter.set('views','./views/admin')


adminRouter.use(express.static(path.join(__dirname,'../public')))


//MULTER
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/productImage'))
    },
    filename:function(req,file,cb){
        const name= Date.now()+'-'+file.originalname;
        cb(null,name)
    }

})

const upload= multer({storage:storage})


// adminRouter.set('views','./views/client')
// adminRouter.set('views','./views/layout')
adminRouter.use(express.static(path.join(__dirname,'../public/admin')))


adminRouter.get('/productAdmin',authantication.isadminlogin,adminProductController.productAdmin)
adminRouter.get('/addCategory',authantication.isadminlogin,adminCategoryController.addCategory)
adminRouter.get('/editProduct',authantication.isadminlogin,adminProductController.editProduct)
adminRouter.get('/addProduct',authantication.isadminlogin,adminProductController.addProduct)
adminRouter.get('/adminWelcome',authantication.isadminlogin,adminController.adminDashboard)
adminRouter.get('/logoutadmin',authantication.isadminlogin,adminController.logoutadmin)
adminRouter.get('/clientview',authantication.isadminlogin,adminController.clientview)
adminRouter.get('/editUser',authantication.isadminlogin,adminController.editUser)
adminRouter.post('/addCategory',adminCategoryController.addCategorySumbit)
adminRouter.post('/updateClient',adminController.updateClient)
adminRouter.post('/deleteClient',adminController.deleteClient)
adminRouter.post('/Updateproduct',upload.array('image',4),adminProductController.Updateproduct)
adminRouter.post('/addProduct',upload.array('image',4),adminProductController.addProductsubmit)
adminRouter.post('/delete',adminProductController.deleteProduct)
module.exports=adminRouter;

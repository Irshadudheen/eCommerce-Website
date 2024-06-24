const express = require('express')
const adminRouter = express()
const upload = require('../middleware/multer')
const {adminDashboard,blockClient,clientView,deleteClient,editUser,logoutAdmin,updateClient} = require('../controller/adminController')
const {addProduct,addProductSubmit,blockProduct,cropImage,delectTheImage,editProduct,productAdmin,updateProduct} = require('../controller/productController')
const {addCategory,deleteCategory,editCategory,statusCategory,viewCategory,editCategorySubmit,addCategorySumbit} = require('../controller/categoryController')
const {invoice,orderlist,updateSatus,updateSatusOfOrderProduct} = require('../controller/orderController')
const {admimEditCoupon,adminAddCoupon,checkCouponDb,couponAdmin,deleteTheCoupon} = require('../controller/couponController')
const {ViewCategoryOffer,addCategoryOffer,deleteTheOffer,editCategoryOffer} = require('../controller/offerController')
const {isadminlogin} = require('../middleware/authantication')
const {reportPage} = require('../controller/reportController')

const path = require('path')
adminRouter.set('views', './views/admin')
adminRouter.use(express.static(path.join(__dirname, '../public')))
adminRouter.use(express.static(path.join(__dirname, '../public/admin')))


adminRouter.get('/deleteCategory',isadminlogin, deleteCategory)
adminRouter.post('/delectTheImage', isadminlogin, delectTheImage)
adminRouter.post('/adminAddCoupon',isadminlogin,adminAddCoupon)
adminRouter.get('/editCategory', isadminlogin, editCategory)
adminRouter.get('/ViewCategory', isadminlogin, viewCategory)
adminRouter.get('/productAdmin', isadminlogin, productAdmin)
adminRouter.post('/Updateproduct', upload.array('image', 4), updateProduct)
adminRouter.post('/addProduct', upload.array('image', 4), addProductSubmit)
adminRouter.get('/addCategory', isadminlogin, addCategory)
adminRouter.get('/ViewOffer',isadminlogin,ViewCategoryOffer)
adminRouter.get('/editProduct', isadminlogin, editProduct)
adminRouter.get('/addProduct', isadminlogin, addProduct)
adminRouter.get('/adminWelcome', isadminlogin, adminDashboard)
adminRouter.post('/updateSatusOfOrderProduct',updateSatusOfOrderProduct)
adminRouter.get('/couponAdmin',isadminlogin,couponAdmin)
adminRouter.get('/orderlist', isadminlogin, orderlist)
adminRouter.get('/blockClient', isadminlogin, blockClient)
adminRouter.get('/logoutadmin', isadminlogin, logoutAdmin)
adminRouter.get('/clientview', isadminlogin, clientView)
adminRouter.post('/cropImage',upload.single('image'),cropImage)
adminRouter.get('/invoice',isadminlogin,invoice)
adminRouter.get('/editUser', isadminlogin, editUser)
adminRouter.get('/report',isadminlogin,reportPage)
adminRouter.post('/adminaddOfferCatogory',addCategoryOffer)
adminRouter.post('/editCategoryOffer',editCategoryOffer)
adminRouter.post('/editCategory', editCategorySubmit)
adminRouter.patch('/statusCategory', statusCategory)
adminRouter.post('/addCategory', addCategorySumbit)
adminRouter.post('/deleteTheCoupon',deleteTheCoupon)
adminRouter.post('/admimEditCoupon',admimEditCoupon)
adminRouter.post('/deleteTheOffer',deleteTheOffer)
adminRouter.post ('/checkCouponDb',checkCouponDb)
adminRouter.post('/updateSatus', updateSatus)
adminRouter.post('/block', blockProduct)
adminRouter.post('/updateClient', updateClient)
adminRouter.post('/deleteClient', deleteClient)

module.exports = adminRouter;

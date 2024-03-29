const express = require('express')
const adminRouter = express()
const upload = require('../middleware/multer')
const adminController = require('../controller/adminController')
const adminProductController = require('../controller/productController')
const adminCategoryController = require('../controller/categoryController')
const adminOrderController = require('../controller/orderController')
const adminCouponController = require('../controller/couponController')
const adminOfferController = require('../controller/offerController')
const authantication = require('../middleware/authantication')
const reportController = require('../controller/reportController')
const chartController = require('../controller/chartDataController')
const path = require('path')
adminRouter.set('views', './views/admin')
adminRouter.use(express.static(path.join(__dirname, '../public')))
adminRouter.use(express.static(path.join(__dirname, '../public/admin')))


adminRouter.get('/deleteCategory', authantication.isadminlogin, adminCategoryController.deleteCategory)
adminRouter.post('/delectTheImage', authantication.isadminlogin, adminProductController.delectTheImage)
adminRouter.post('/adminAddCoupon',authantication.isadminlogin,adminCouponController.adminAddCoupon)
adminRouter.get('/editCategory', authantication.isadminlogin, adminCategoryController.editCategory)
adminRouter.get('/ViewCategory', authantication.isadminlogin, adminCategoryController.viewCategory)
adminRouter.get('/productAdmin', authantication.isadminlogin, adminProductController.productAdmin)
adminRouter.post('/Updateproduct', upload.array('image', 4), adminProductController.updateProduct)
adminRouter.post('/addProduct', upload.array('image', 4), adminProductController.addProductSubmit)
adminRouter.get('/addCategory', authantication.isadminlogin, adminCategoryController.addCategory)
adminRouter.get('/ViewOffer',authantication.isadminlogin,adminOfferController.ViewCategoryOffer)
adminRouter.get('/editProduct', authantication.isadminlogin, adminProductController.editProduct)
adminRouter.get('/addProduct', authantication.isadminlogin, adminProductController.addProduct)
adminRouter.get('/adminWelcome', authantication.isadminlogin, adminController.adminDashboard)
adminRouter.post('/updateSatusOfOrderProduct',adminOrderController.updateSatusOfOrderProduct)
adminRouter.get('/couponAdmin',authantication.isadminlogin,adminCouponController.couponAdmin)
adminRouter.get('/orderlist', authantication.isadminlogin, adminOrderController.orderlist)
adminRouter.get('/blockClient', authantication.isadminlogin, adminController.blockClient)
adminRouter.get('/logoutadmin', authantication.isadminlogin, adminController.logoutAdmin)
adminRouter.get('/clientview', authantication.isadminlogin, adminController.clientView)
adminRouter.post('/cropImage',upload.single('image'),adminProductController.cropImage)
adminRouter.get('/invoice',authantication.isadminlogin,adminOrderController.invoice)
adminRouter.get('/editUser', authantication.isadminlogin, adminController.editUser)
adminRouter.get('/report',authantication.isadminlogin,reportController.reportPage)
adminRouter.post('/adminaddOfferCatogory',adminOfferController.addCategoryOffer)
adminRouter.post('/editCategoryOffer',adminOfferController.editCategoryOffer)
adminRouter.post('/editCategory', adminCategoryController.editCategorySubmit)
adminRouter.patch('/statusCategory', adminCategoryController.statusCategory)
adminRouter.post('/addCategory', adminCategoryController.addCategorySumbit)
adminRouter.post('/deleteTheCoupon',adminCouponController.deleteTheCoupon)
adminRouter.post('/admimEditCoupon',adminCouponController.admimEditCoupon)
adminRouter.post('/deleteTheOffer',adminOfferController.deleteTheOffer)
adminRouter.post ('/checkCouponDb',adminCouponController.checkCouponDb)
adminRouter.post('/updateSatus', adminOrderController.updateSatus)
adminRouter.post('/block', adminProductController.blockProduct)
adminRouter.post('/updateClient', adminController.updateClient)
adminRouter.post('/deleteClient', adminController.deleteClient)

module.exports = adminRouter;

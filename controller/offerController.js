const categoryDb = require("../model/categoryDb")
const offerDb = require("../model/offerDb")
const productDb = require("../model/productDb")
//
const ViewCategoryOffer = async (req,res)=>{
    try {
        const message=req.flash('message')
        const category = await categoryDb.find({status:true})
        
      
        const offer = await offerDb.find().populate('categoryId').populate('productId')
         const product = await productDb.find({status:true})
        
        res.render('Offer',{category,offer,message,product})
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//ADD OFFER ADMIN
const addCategoryOffer = async (req,res)=>{
    try {
       
        const {category,amount,exprDate,name,productId}= req.body
        console.log(category)
        if(category){

            const checkCatogery = await offerDb.findOne({categoryId:category})
            console.log(checkCatogery,9000000000000000000000000000000000000000)
            if(checkCatogery){
                req.flash('message','The offer already exists in that categery')
                return  res.redirect('/admin/ViewOffer')
            }
        }else if(productId){
            const checkTheProduct = await offerDb.findOne({productId})
            if(checkTheProduct){
                req.flash('message','The offer already exists in that Product')
                return  res.redirect('/admin/ViewOffer')

            }

        }
       
        const offerCategory = new offerDb({
            name,
            categoryId:category,
            amount,
            productId,
            createDate:Date.now(),
            expreDate:exprDate,
            
        })
        const addOffer = await offerCategory.save()
        if(addOffer){
            res.redirect('/admin/ViewOffer')
        }
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
        
    }
}

//EDIT THE OFFER CATEGORY
const editCategoryOffer = async (req,res)=>{
    try {
       
        const {_id,name,amount,exprDate,method,description}=req.body
        const checkOffer = await offerDb.findOne({name})
      console.log(checkOffer)
      console.log(_id)
        if(checkOffer._id==_id||checkOffer==null){
            console.log('sikljsdiojk    ')
            const offerDataUpdate = await offerDb.findByIdAndUpdate({_id},{$set:{name,amount,method,expreDate:exprDate,description}})

            if(offerDataUpdate){
                res.redirect('/admin/ViewOffer')
            }
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
        
    }
}

//OFFER MESSAGE FOR CLIENT
const deal = async (req,res)=>{
    try {
      
        res.render('deal')
    
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }

}

//deleteTheOffer
const deleteTheOffer = async (req,res)=>{
    try {
        const {item_id}=req.body
        const deleteOffer = await offerDb.deleteOne({$or:[{categoryId:item_id},{productId:item_id}]})
        if(deleteOffer){
            res.send({status:true})
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
        
    }
}

module.exports={
    ViewCategoryOffer,
    addCategoryOffer,
    editCategoryOffer,
    deal,
    deleteTheOffer
}
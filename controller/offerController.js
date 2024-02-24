const categoryDb = require("../model/categoryDb")
const offerCategoryDb = require("../model/offerCategoryDb")
//
const ViewCategoryOffer = async (req,res)=>{
    try {
        const category = await categoryDb.find({status:true})
        console.log(category)
        const offerCategory = await offerCategoryDb.find().populate('categoryId')
        res.render('CategoryOffer',{category,offerCategory})
    } catch (error) {
        console.log(error.message)
    }
}

//ADD OFFER ADMIN
const addCategoryOffer = async (req,res)=>{
    try {
        console.log(req.body)
        const {category,amount,method,exprDate,description,name}= req.body
        const {filename}=req.file
        console.log(filename)
        const offerCategory = new offerCategoryDb({
            name,
            categoryId:category,
            amount,
            method,
            createDate:Date.now(),
            expreDate:exprDate,
            image:filename,
            description
        })
        const addOffer = await offerCategory.save()
        if(addOffer){
            res.redirect('/admin/ViewCategoryOffer')
        }
        
    } catch (error) {
        console.log(error.message)
        
    }
}

//EDIT THE OFFER CATEGORY
const editCategoryOffer = async (req,res)=>{
    try {
        console.log(req.body)
        const {_id,name,amount,exprDate,method,description}=req.body
        const offerDataUpdate = await offerCategoryDb.findByIdAndUpdate({_id},{$set:{name,amount,method,expreDate:exprDate,description}})
        if(offerDataUpdate){
            res.redirect('/admin/ViewCategoryOffer')
        }
    } catch (error) {
        console.log(error.message)
        
    }
}


module.exports={
    ViewCategoryOffer,
    addCategoryOffer,
    editCategoryOffer
}
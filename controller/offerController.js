const categoryDb = require("../model/categoryDb")
const offerCategoryDb = require("../model/offerCategoryDb")
//
const ViewCategoryOffer = async (req,res)=>{
    try {
        const category = await categoryDb.find({status:true})
        console.log(category)
        res.render('CategoryOffer',{category})
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

module.exports={
    ViewCategoryOffer,
    addCategoryOffer
}
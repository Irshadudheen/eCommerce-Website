const categoryDb = require("../model/categoryDb")
const offerDb = require("../model/offerDb")
//
const ViewCategoryOffer = async (req,res)=>{
    try {
        const category = await categoryDb.find({status:true})
        console.log(category)
        const offerCategory = await offerDb.find().populate('categoryId')
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
        const offerCategory = new offerDb({
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
            res.redirect('/admin/ViewOffer')
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
        const checkOffer = await offerDb.findOne({name})
        console.log(_id==checkOffer._id)
        if(checkOffer._id==_id){
            const offerDataUpdate = await offerDb.findByIdAndUpdate({_id},{$set:{name,amount,method,expreDate:exprDate,description}})

            if(offerDataUpdate){
                res.redirect('/admin/ViewOffer')
            }
        }
    } catch (error) {
        console.log(error.message)
        
    }
}

//OFFER MESSAGE FOR CLIENT
const deal = async (req,res)=>{
    try {
        console.log("dckckjkccjmdjdjdjdjdjdjjdjdjdjj")
        res.render('deal')
        
    } catch (error) {
        console.log(error.message)
    }
}

module.exports={
    ViewCategoryOffer,
    addCategoryOffer,
    editCategoryOffer,
    deal
}
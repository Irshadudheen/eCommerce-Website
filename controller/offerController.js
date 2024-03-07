const categoryDb = require("../model/categoryDb")
const offerDb = require("../model/offerDb")
//
const ViewCategoryOffer = async (req,res)=>{
    try {
        const {message}=req.query
        const category = await categoryDb.find({status:true})
        
      
        const offerCategory = await offerDb.find().populate('categoryId')
         
        res.render('CategoryOffer',{category,offerCategory,message})
    } catch (error) {
        console.log(error.message)
    }
}

//ADD OFFER ADMIN
const addCategoryOffer = async (req,res)=>{
    try {
       
        const {category,amount,exprDate,name}= req.body
        const checkCatogery = await offerDb.findOne({categoryId:category})
        if(checkCatogery){
            return  res.redirect('/admin/ViewOffer?message="The offer already exists in that categery"')
        }
       
        const offerCategory = new offerDb({
            name,
            categoryId:category,
            amount,
            createDate:Date.now(),
            expreDate:exprDate,
            
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
       
        const {_id,name,amount,exprDate,method,description}=req.body
        const checkOffer = await offerDb.findOne({name})
      
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
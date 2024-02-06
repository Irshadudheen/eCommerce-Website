
const categoryDb = require('../model/categoryDb')


//LOAD THE PAGE ADDCATEGORY
const addCategory = async (req,res)=>{
    try {
        
        res.render('addCategory')
    } catch (error) {
        console.log(error.message)
    }
}

//SUBMIT THE PAGE OF ADD CCATEGORY
const addCategorySumbit = async (req,res)=>{
    try {
        

        const name= req.body.name
        const checkCatogery = await categoryDb.findOne({name:{$regex:new RegExp("^" + name +"$","i")}})
        if(!checkCatogery){

            const description = req.body.description
            
            const status =req.body.status
            
            
            
            const category= await categoryDb({
                name:name,
                description:description,
                status:status,
                
            })
            const result = await category.save()
            console.log(result)
            if (result) {
                res.redirect('/admin/viewCategory')

            }

            
        }else {
            res.render('addCategory',{message:'category is already exist'})
        }
    } catch (error) {
        console.log(error.message)
    }
}

//
const ViewCategory = async (req,res)=>{
    try {
        const category = await categoryDb.find()
        res.render('ViewCategory',{category})
        
    } catch (error) {
        console.log(error.message)
        
    }
}

const deleteCategory = async (req,res)=>{
    try {
        await categoryDb.deleteOne({_id:req.query.id})
        return res.redirect('/admin/ViewCategory')
    } catch (error) {
        console.log(error.message)
        
    }
}

//EDIT THE CATEGORY
const editCategory = async (req,res)=>{
    try {
        const {id}=req.query
        console.log(id);
        const dataCatogory = await categoryDb.findOne({_id:id})
        console.log(dataCatogory.description)
        res.render('editCategory',{dataCatogory})
        
    } catch (error) {
        console.log(error.message)
        
    }
}

//
const editCategorySubmit =async (req,res)=>{
    try {
        console.log("fetch the data ")
        const {id,name,description}=req.body
        const checkdata = await categoryDb.findOne({name:{$regex:new RegExp('^'+name+"$","i")}})
        if(!checkdata){

            console.log(req.body,req.query)
            const categoryUpdate = await categoryDb.updateOne({_id:id},{$set:{name,description}})
            console.log(categoryUpdate)
            
        }else{
            console.log("the catogory is already exists")
        }
            
        
        
    } catch (error) {
        console.log(error.message)
        
    }
}

module.exports={
    addCategory,
    addCategorySumbit,
    ViewCategory,
    deleteCategory,
    editCategory,
    editCategorySubmit
    
    

}
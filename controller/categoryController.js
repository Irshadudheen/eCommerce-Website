
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
            res.render('addCategory',{message:'category is already exits'})
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
        console.log(req.query.id)
        await categoryDb.deleteOne({_id:req.query.id})
        return res.redirect('/admin/ViewCategory')
    } catch (error) {
        console.log(error.message)
        
    }
}


module.exports={
    addCategory,
    addCategorySumbit,
    ViewCategory,
    deleteCategory
}
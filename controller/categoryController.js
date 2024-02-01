
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
        console.log(req.body.name,req.body.description,req.body.status)

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
                res.render('addCategory',{message:'category addded success'})

            }

            
        }else {
            res.render('addCategory',{message:'category is already exits'})
        }
    } catch (error) {
        console.log(error.message)
    }
}




module.exports={
    addCategory,
    addCategorySumbit
}
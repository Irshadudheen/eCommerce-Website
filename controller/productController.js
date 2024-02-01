const productDb = require('../model/productDb')

const Clientproduct = async (req,res)=>{
    try {
        const product= await productDb.find({})
        console.log(product)
        res.render('product',{productData:product})
        
    } catch (error) {
        console.log(error.message)
    }
}


const eachproduct = async (req,res)=>{
    try {
        
        res.render('eachproduct',{image:req.query.id})
        
    } catch (error) {
        console.log(error.message)
        
    }
}
//
const productAdmin= async (req,res)=>{
    try {
        const Allproduct = await productDb.find({})
        console.log(Allproduct)
        res.render('productAdmin',{product:Allproduct})
    } catch (error) {
        console.log(error.message)
    }
}
//
const addProduct = async (req,res)=>{
    try {
        res.render('addProduct')
        
    } catch (error) {
        console.log(error.message)
    }
}
//EDIT THE PRODUCT
const editProduct = async (req,res)=>{
    try {
        
      
        // const productData= await productDb.findByIdAndUpdate({_id:id},{$set:{ name:req.body.name,email:req.body.email,mobile:req.body.mobile }},{new:true})

        
        res.render('editProduct',{id:req.query.id})
    } catch (error) {
        console.log(error.message)
        
    }
}
const addProductsubmit = async (req,res)=>{
    try {
        
        const product    = new productDb({
            name:req.body.name,
            price:req.body.price,
            status:req.body.stock,
            quantity:1,
            categoryid:req.body.category,
            createdate:Date.now(),
            image:req.files.map(file=>file.filename),
            productDescription:req.body.description
        })
        const result = await product.save()
        if(result){
            res.redirect('/admin/productAdmin')
        }
        console.log(result)

    } catch (error) {
        console.log(error.message)
        
    }
}
//UPDATEPRODUCT
const Updateproduct = async (req,res)=>{
    try {
      

        
        const product = await productDb.findByIdAndUpdate({_id:req.body.id},
            {name:req.body.name,
                price:req.body.price,
                status:req.body.status,
                quantity:req.body.quantity,
                categoryid:req.body.category,
                image:req.files.map(file=>file.filename),
                productDescription:req.body.description,
            
            },{new:true})
            console.log(product)
            res.redirect('/admin/productAdmin')
        
    } catch (error) {
        console.log(error.message)
    }
}


module.exports={
    eachproduct,
    productAdmin,
    addProduct,
    editProduct,
    addProductsubmit,
    Updateproduct,
    Clientproduct
}
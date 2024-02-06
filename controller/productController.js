const productDb = require('../model/productDb')
const categoryDb=require('../model/categoryDb')

//TOTAL VIEW OF PRODUCT IN CLIENT
const Clientproduct = async (req,res)=>{
    try {
        const product= await productDb.find({})
        res.render('product',{productData:product})
        
    } catch (error) {
        console.log(error.message)
    }
}

//SELCTED PRODUCT IN CLIENT
const eachproduct = async (req,res)=>{
    try {
        const productData =await productDb.findOne({_id:req.query.id})
        res.render('eachproduct',{productData})
        
    } catch (error) {
        console.log(error.message)
        
    }
}

//PRODUCT VIEW
const productAdmin= async (req,res)=>{
    try {
        const Allproduct = await productDb.find().populate("categoryid")
        console.log(Allproduct.categoryid,"category");
        console.log(Allproduct)
        

        res.render('productAdmin',{product:Allproduct})
    } catch (error) {
        console.log(error.message)
    }
}

//ADD PRODUCT THE PAGE
const addProduct = async (req,res)=>{
    try {
        const category = await categoryDb.find()


        res.render('addProduct',{category})
        
    } catch (error) {
        console.log(error.message)
    }
}

//EDIT THE PRODUCT
const editProduct = async (req,res)=>{
    try {
        
        const category = await categoryDb.find()

        // const productData= await productDb.findByIdAndUpdate({_id:id},{$set:{ name:req.body.name,email:req.body.email,mobile:req.body.mobile }},{new:true})
        const productData= await productDb.findOne({_id:req.query.id})
        console.log(productData);
        res.render('editProduct',{id:req.query.id,productData,category})
    } catch (error) {
        console.log(error.message)
        
    }
}

//TO ADD THE PRODUCT SUBMIT
const addProductsubmit = async (req,res)=>{
    try {
        const {name,price,stock,category,description}=req.body
        
        console.log(stock)
        // const checkName =await find({name:{$regex: new RegExp("^"+name+"$","i")}})
        // console.log(checkName);
    

            console.log(name)
            const product    = new productDb({
                name,
                price,
                status:true,
                quantity:stock,
                categoryid:category,
                createdate:Date.now(),
                image:req.files.map(file=>file.filename),
                productDescription:description
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

      
            const {name,price,status,quantity,category,description}=req.body
        if(req.files.length == 0){
            const product = await productDb.findByIdAndUpdate({_id:req.body.id},
                {name,
                    price,
                    status,
                    quantity,
                    categoryid:category,
                    productDescription:description,
                
                },{new:true})
                console.log(product)
            return   res.redirect('/admin/productAdmin')

        }
        const product = await productDb.findByIdAndUpdate({_id:req.body.id},
            {name,
                price,
                status,
                quantity,
                categoryid:category,
                image:req.files.map(file=>file.filename),
                productDescription:description,
            
            },{new:true})
            
            res.redirect('/admin/productAdmin')
        
    } catch (error) {
        console.log(error.message)
    }
}

//TO DELETE THE PRODUCT
const deleteProduct= async (req,res)=>{
    try {
        // req.body.id
        console.log(req.body.ida)
    
        const deleteProduct =await productDb.deleteOne({_id:req.body.ida})
        
        if(deleteProduct){
        res.send({status: true})
        }

        
    } catch (error) {
        console.log(error.message)
        
    }
}

//DELETE THE IMAGE
const delectTheImage = async (req,res)=>{
    try {
        console.log(req.body)
        const {image,id}=req.body
        
        
        const deleteTheImage = await productDb.updateOne({_id:id},{$pull:{image}})
        if(delectTheImage){
            res.send({status: true})
            console.log(delectTheImage)
            console.log("sduifxjkwaefyuhijedfvyuhdjwdfhjcdfvhffddddddd")

            
        }
        
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
    Clientproduct,
    deleteProduct,
    delectTheImage
}
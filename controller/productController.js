const productDb = require('../model/productDb')
const categoryDb = require('../model/categoryDb')
const wishlistDb = require('../model/wishlistDb')
const cartDb = require('../model/cartDb')

const path = require('path')
const fs = require('fs')
const offerDb = require('../model/offerDb')

//TOTAL VIEW OF PRODUCT IN CLIENT
const clientProduct = async (req, res) => {
    try {
        let productCount = await productDb.countDocuments()
        const sortOption= req.query.sort
        const perPage = 6;
        const currentPage = parseInt(req.query.page, 10) || 1;
        const skip = (currentPage - 1) * perPage;
        const offer= await offerDb.find()
        const search = req.query.q
        let searchData={}
        if(search){
            searchData = { name: { $regex: search, $options: 'i' } } 
            productCount=  await productDb.find({name:searchData.name}).countDocuments()
        }
        
        const {user_id}=req.session
      
        let sort = {};
        if (sortOption === 'default') {
            sort = { createdate: -1 };
        } else if (sortOption === 'priceLowToHigh') {
            sort = { price: 1 };
            
        } else if (sortOption === 'priceHighToLow') {
            sort = { price: -1  };
        } else if (sortOption === 'name') {
            sort = { name: 1 };
        }
        console.log("sort",sort);
        let product=[]
        if(search){
             product = await productDb.find({ $and:[{status: true},{name:searchData.name} ]}).sort(sort).skip(skip).limit(perPage).populate({
                path: "categoryid",
                match: { status: true }
            }).exec()

        }else{
             product = await productDb.find({status: true} ).sort(sort).skip(skip).limit(perPage).populate({
                path: "categoryid",
                match: { status: true }
            }).exec()
            
        }
        
       
        const wishlist = await wishlistDb.findOne({clientId:user_id})
        
        const filteredProduct = product.filter(product => product.categoryid !== null)
        filteredProduct.forEach(product=>{
            offer.forEach(ele=>{
                if(ele.categoryId &&product.categoryid._id.toString()==ele.categoryId.toString()){
                    applyOffer(product,ele.amount)
                }
                if(ele.productId&&product._id.toString()==ele.productId.toString()){
                    applyOffer(product,ele.amount)
                }
                function applyOffer(product,amount){
                    if(!product.oldPrice){
                        product.oldPrice=product.price

                    }
                    const discountedPrice=  product.price - (product.price * amount) / 100;
                    product.price=Math.round(Math.min(product.price, discountedPrice)) ;

                }
                })
        })
         
        const totalPages =Math.ceil(productCount/perPage) 
        const cart = await cartDb.findOne({clientId:user_id})
        const cartCount = cart?.products.length
        res.render('product', { productData: filteredProduct,sortOption ,totalPages,wishlist,cartCount,currentPage});


    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//SELCTED PRODUCT IN CLIENT
const eachProduct = async (req, res) => {
    try {

        const {id}=req.query
        if(id.length!==24){
         return   res.redirect('/404')
        }
        const productData = await productDb.findOne({_id:id})
        if(!productData){
          return  res.redirect('/404')
        }
        const offer = await offerDb.find()
       
        const cartOne = await  cartDb.findOne({clientId:req.session.user_id})
        const cartCount = cartOne?.products.length

        offer.forEach(ele=>{
            if(ele.categoryId&&ele.categoryId.toString()===productData.categoryid.toString()){
                applyOffer(productData,ele.amount)
            }
            if(ele.productId&&ele.productId.toString()===productData._id.toString()){
                applyOffer(productData,ele.amount)
            }
        })
        function applyOffer(product,amount){
         
            const discountedPrice=product.price-(product.price*amount)/100
            product.price=Math.round(Math.min(product.price,discountedPrice))
        }
      
        res.render('eachproduct', { productData,cartCount})

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

//PRODUCT VIEW
const productAdmin = async (req, res) => {
    try {
        const perPage = 3;
        const currentPage = parseInt(req.query.page, 10) || 1;
        const skip = (currentPage - 1) * perPage;
        const Allproduct = await productDb.find().skip(skip).limit(perPage).populate({
            path: "categoryid",
            match: { status: true }
        })
        const filteredProduct = Allproduct.filter(product => product.categoryid !== null)
        const productCount = await productDb.countDocuments()
        const totalPages =Math.ceil(productCount/perPage) 
        res.render('productAdmin', { product: filteredProduct,productCount,totalPages,currentPage })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//ADD PRODUCT THE PAGE
const addProduct = async (req, res) => {
    try {
        const category = await categoryDb.find()
        if(req.session.productImage){
            req.session.productImage=null;
        }
        res.render('addProduct', { category })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//EDIT THE PRODUCT
const editProduct = async (req, res) => {
    try {

        const category = await categoryDb.find({status:true})

        // const productData= await productDb.findByIdAndUpdate({_id:id},{$set:{ name:req.body.name,email:req.body.email,mobile:req.body.mobile }},{new:true})
        if(req.query.id.length!==24) return res.redirect('/404')
        const productData = await productDb.findOne({ _id: req.query.id })
        if(!productData){
          return  res.redirect('/404')
        }
        res.render('editProduct', { id: req.query.id, productData, category })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

//TO ADD THE PRODUCT SUBMIT
const addProductSubmit = async (req, res) => {
    try {
        const { name, price, stock, category, description } = req.body
        console.log(stock)
        // const checkName =await find({name:{$regex: new RegExp("^"+name+"$","i")}})
        // console.log(checkName);
        const image= req.files.map(file => file.filename);

        console.log(name)
        const product = new productDb({
            name,
            price,
            status: true,
            quantity: stock,
            categoryid: category,
            createdate: Date.now(),
            image:req.session.productImage,
            productDescription: description
        })
        const result = await product.save()
        if (result) {
          return  res.redirect('/admin/productAdmin')
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

//UPDATEPRODUCT
const updateProduct = async (req, res) => {
    try {


        const { name, price, status, quantity, category, description } = req.body
        if (req.files.length == 0) {
            const product = await productDb.findByIdAndUpdate({ _id: req.body.id },
                {
                    name,
                    price,
                    quantity,
                    categoryid: category,
                    productDescription: description,

                }, { new: true })
            console.log(product)
            return res.redirect('/admin/productAdmin')

        }
        const product = await productDb.findByIdAndUpdate({ _id: req.body.id },
            {
                name,
                price,
                status,
                quantity,
                categoryid: category,
                image: req.files.map(file => file.filename),
                productDescription: description,

            }, { new: true })

        res.redirect('/admin/productAdmin')

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//TO BLOCK THE PRODUCT
const blockProduct = async (req, res) => {
    try {
        // req.body.id
        const { id } = req.body
        console.log(req.body.id)
        const checkProductStatus = await productDb.findOne({ _id: id })
        if (checkProductStatus.status == false) {

            const deleteProduct = await productDb.findByIdAndUpdate({ _id: id }, { $set: { status: true } })
            if (deleteProduct) {
                res.send({ status: true })
            }
        } else {
            const deleteProduct = await productDb.findByIdAndUpdate({ _id: id }, { $set: { status: false } })
            if (deleteProduct) {
                res.send({ status: false })
            }
        }



    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

//DELETE THE IMAGE
const delectTheImage = async (req, res) => {
    try {
        console.log(req.body)
        const { image, id } = req.body

        const imagePath= path.join(__dirname, '../public/productImage', image);
        const deleteTheImage = await productDb.updateOne({ _id: id }, { $pull: { image } })
        if (delectTheImage) {
            res.send({ status: true })
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return;
                }
                console.log('File deleted successfully.');
            });
            console.log(delectTheImage)
            console.log("sduifxjkwaefyuhijedfvyuhdjwdfhjcdfvhffddddddd")


        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

//CROP PRODUCT IMAGE
const cropImage = async (req,res)=>{
    try {
    
        const {binaryImage}= req.body
        console.log(req.file,1111111111111111111111111111)
        const name=Date.now()+'.jpg'
        if(!req.session.productImage){

            req.session.productImage=[]
        }
        const{productImage}=req.session
        productImage.push(name)
        console.log(productImage,'34')
        const imagePath=  path.join(__dirname, '../public/productImage',name)

        const base64Image = binaryImage.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Image, 'base64');
        fs.writeFile(imagePath, buffer, (err) => {
            if (err) {
                console.error('Error writing image:', err);
            } else {
                console.log('Image saved successfully.');
            }
        });
        
       

            res.send({ status: true });
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
        
    }
}



module.exports = {
    eachProduct,
    productAdmin,
    addProduct,
    editProduct,
    addProductSubmit,
    updateProduct,
    clientProduct,
    blockProduct,
    delectTheImage,
    cropImage
}
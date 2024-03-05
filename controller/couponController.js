const clientDb = require("../model/clientDb")
const couponDb = require("../model/couponDb")

//VIEW COUPON IN ADMIN SIDE
const couponAdmin = async (req,res)=>{
    try {
        const couponData = await couponDb.find()
        res.render('coupon',{couponData})
    } catch (error) {
        console.log(error.message)
        
    }
}

//ADMIN ADD COUPON
const adminAddCoupon = async (req,res)=>{
    try {
        const{name,amount,method,exprDate}=req.body
        console.log(req.body)
        const checkCopon = await couponDb.findOne({ name: { $regex: new RegExp('^' + name + "$", "i") } })
        console.log(checkCopon)
        if(!checkCopon){

            const datenow= Date.now()
            const currentDate = new Date(datenow);
        const exprDate1= new Date(exprDate)
        if(exprDate1>currentDate){
               

            
    const couponId= randomStr(6, '12345ab#@$&*cde');
    console.log(couponId,"sdjkdsil")

                const saveCoupon =new couponDb({
                    name,
                    amount,
                        couponId,
                        method,
                        createDate:currentDate,
                        exprDate:exprDate,
                        
                    })
                   const data= await saveCoupon.save()
                   if(data){
                  
                    res.redirect('/admin/couponAdmin')
                   }
                   
                }
            }else{
                res.send({status:false})
            }
                
            } catch (error) {
                console.log(error.message)
        
    }
}

//RANDOM STRING
const randomStr=(len, arr)=> {
    try {
        console.log("adofksikm")
        let ans = '';
    for ( i = len; i > 0; i--) {
        ans +=
            arr[(Math.floor(Math.random() * arr.length))];
    }
    console.log(ans,32323)
    return ans
    
} catch (error) {
       console.log(error.message) 
}
}
    
//DELETE THE COUPON
const deleteTheCoupon = async (req,res)=>{
    try {
        const{couponId}=req.body

        const deleteCoupon = await couponDb.deleteOne({_id:couponId})
        
        if(deleteCoupon){
            res.send({status:true})
        }
        
    } catch (error) {
        console.log(error.message)
        
    }
}

//COUPON EDIT
const admimEditCoupon = async (req,res)=>{
    try {
        const{name,amount,method,exprDate,_id}=req.body
        console.log(req.body)
        
        const checkAlreadyHave = await couponDb.findOne({name: { $regex: new RegExp('^' + name + "$", "i")}})
        if(checkAlreadyHave==null){
            if(exprDate.trim()){

                const updatCoupon = await couponDb.findOneAndUpdate({_id},{$set:{name,amount,method,exprDate}})
                
                if(updatCoupon){
                    res.send({status:true})
                }
            }else{
                const updatCoupon = await couponDb.findOneAndUpdate({_id},{$set:{name,amount,method}})
                
                if(updatCoupon){
                    res.send({status:true})
                }

            }
        }else if(checkAlreadyHave._id==_id){
            if(exprDate.trim()){

                const updatCoupon = await couponDb.findOneAndUpdate({_id},{$set:{name,amount,method,exprDate}})
                if(updatCoupon){
                    res.send({status:true})
                    res.redirect('/admin/couponAdmin')
                }
            }else{
                const updatCoupon = await couponDb.findOneAndUpdate({_id},{$set:{name,amount,method}})
                if(updatCoupon){
                    res.send({status:true})
                    res.redirect('/admin/couponAdmin')
                }

            }
        }else{
            res.send({status:false,message:'the coupon is already have'})
            
        }
       

        
        
    } catch (error) {
        console.log(error.message)
    }
}


const checkCopon = async (req,res)=>{
    try {
        const {userTypeID,totalPrice}=req.body
        const {user_id}=req.session
        const existingCoupon = await couponDb.findOne({couponId:userTypeID})
        if(existingCoupon){
            const{name,amount,exprDate,method}=existingCoupon
            const dateNow= Date.now()
            if(dateNow<=exprDate){
            const  userAlreadyUseTheCoupon= existingCoupon.users.some(user=>user.clientId==user_id)
            
            if(userAlreadyUseTheCoupon){
              return  res.send({status:"the coupon is already used"})

            }else{

                // const checkId = await couponDb.findOne({couponId:userTypeID,'users.clientId':user_id})
             
                    console.log(name,amount,exprDate,method)
                    req.session.coupon=existingCoupon._id
                    if(method=='fixed amount'){
                        const offerPrice = totalPrice-amount
                        console.log(offerPrice)
                        return  res.send({status:true,name,offerPrice})

                        
                    }else if(method=="percentage"){
                        const offerPrice = totalPrice-(totalPrice*amount)/100
                        
                        console.log(offerPrice)
                        return  res.send({status:true,name,offerPrice})
                        
                
                       
                  
                    }
                    
                }
                
            }else{
                return  res.send({status:"The coupon date expried"})

            }
        }else{
          return  res.send({status:"the coupon is not exist"})
        }

        
    } catch (error) {
        console.log(error.message)
        
    }
}

//admin side check coupon
const checkCouponDb = async (req,res)=>{
    try {
        console.log("suijsdhj")
        console.log(req.body)
        const {input}=req.body
        const checkCoupon = await couponDb.findOne({ name: { $regex: new RegExp('^' + input + "$", "i") } })
        console.log(checkCoupon)
        if(checkCoupon){
            console.log("dshjfsduijhfsdij")
            res.send({status:true})
        }else{
            res.send({status:false})
        }
    } catch (error) {
        console.log(error.message)
    }
}
module.exports={
    couponAdmin,
    adminAddCoupon,
    deleteTheCoupon,
    admimEditCoupon,
    checkCopon,
    checkCouponDb
}
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
        const datenow= Date.now()
        const currentDate = new Date(datenow);
        const exprDate1= new Date(exprDate)
        if(exprDate1>currentDate){
               

 
    const couponId= randomStr(6, '12345ab#@$&*cde');

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
                    
    } catch (error) {
        console.log(error.message)
        
    }
}

//RANDOM STRING
const randomStr=(len, arr)=> {
    try {
        let ans = '';
    for ( i = len; i > 0; i--) {
        ans +=
            arr[(Math.floor(Math.random() * arr.length))];
    }
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
        if(exprDate){

            const updatCoupon = await couponDb.findOneAndUpdate({_id},{$set:{name,amount,method,exprDate}})
            if(updatCoupon){
                res.redirect('/admin/couponAdmin')
            }
        }else{
                        const updatCoupon = await couponDb.findOneAndUpdate({_id},{$set:{name,amount,method}})
                        res.redirect('/admin/couponAdmin')

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
                if(userIdSave){
                    console.log(name,amount,exprDate,method)
                    if(method=='fixed amount'){
                        const offerPrice = totalPrice-amount
                        console.log(offerPrice)
                        return  res.send({status:true,name,offerPrice})

                        
                    }else if(method=="percentage"){
                        const offerPrice = totalPrice-(totalPrice*amount)/100
                        
                        console.log(offerPrice)
                        return  res.send({status:true,name,offerPrice})
                        
                    }
                       
                    }else{
                        console.log("dsijrhsdfmoksdfjmjersdfjumerjdfhsnmreudfjshmredfcjnrdfsjerndfscjerdfnssdfhjndjm")
                        return  res.send({status:"coupon expried"})

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

module.exports={
    couponAdmin,
    adminAddCoupon,
    deleteTheCoupon,
    admimEditCoupon,
    checkCopon
}
const couponDb = require("../model/couponDb")

//VIEW COUPON IN ADMIN SIDE
const couponAdmin = async (req,res)=>{
    try {
        console.log("dfjnejfskdjnmefjdscmfkjm")
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

module.exports={
    couponAdmin,
    adminAddCoupon,
    deleteTheCoupon
}
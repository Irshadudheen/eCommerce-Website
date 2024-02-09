const addressDb = require('../model/addressDb')

const addnewaddress= async(req,res)=>{
    try {
        const{country,streetAddress,city,state,pincode,mobile}=req.body
        console.log(streetAddress)
        const {user_id}=req.session
        console.log(req.body)
        console.log(mobile.length)
       
        let digitsArray = mobile.toString().split('');
           
        if(digitsArray.length==10){
           
            const address = await addressDb({
                clientId:user_id,
                country,
                streetAddress,
                city,
                state,
                pincode,
                mobile
                

            })
            const result = await address.save()
            if(result){
                console.log(result)
            }else{
                console.log("errr")
            }

        }else{
            console.log("length")
        }
        
    } catch (error) {
        console.log(error.message)
        
    }
}
module.exports={
    addnewaddress
}
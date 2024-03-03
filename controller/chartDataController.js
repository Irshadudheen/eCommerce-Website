const orderDb = require("../model/orderDb")

const orderPrdouct = async (req,res)=>{
    try {
        const monthData = new Array(12).fill(0);

        const orderData = await orderDb.find()
       
        orderData.forEach(order => {
            const orderDate = new Date(order.date); 
            const monthIndex = orderDate.getMonth();
            
            monthData[monthIndex]++; 
          
        });
       
        return monthData
        
    } catch (error) {
        console.log(error.message)
        
    }
}
module.exports={
    orderPrdouct

}
const orderDb = require("../model/orderDb");
const productDb = require("../model/productDb");

const orderPrdouct = async (req,res)=>{
    try {
        const currentDate = new Date();
const currentMonthIndex = currentDate.getMonth();
const productQuantities = {};
        const yearlyData =[
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ]
        const currentMonthLabel = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ].slice(0, currentMonthIndex + 1);
     
        const yearlyDeliverd = new Array(12).fill(0)
        const  yearlyCancel = new Array(12).fill(0)
        const  yearlyRetrun = new Array(12).fill(0)
        const  yearlyPlaced = new Array(12).fill(0)
        const monthData = new Array(currentMonthIndex + 1).fill(0);
        const monthDeliverd = new Array(currentMonthIndex + 1).fill(0)
        const  monthCancel = new Array(currentMonthIndex + 1).fill(0)
        const  monthRetrun = new Array(currentMonthIndex + 1).fill(0)
        const  monthPlaced = new Array(currentMonthIndex + 1).fill(0)
        const  paymentMethod = new Array(3).fill(0)
        const dailyData = Array.from({ length: 31 }, () => ({
            delivered: 0,
            cancelled: 0,
            returned: 0,
            placed: 0
        }));

        const orderData = await orderDb.find()
       
        orderData.forEach(order => {

            switch (order.paymentMethod){
                case 'Razorpay':{
                    paymentMethod[0]++
                    break;
                }
                case 'COD':{
                    paymentMethod[1]++
                    break;
                }
                case 'Wallet':{
                    paymentMethod[2]++
                    break;
                }

            }
            order.products.forEach(products=>{
                
                const orderDate = new Date(order.date); 
                const monthIndex = orderDate.getMonth();
                const dayOfMonth = orderDate.getDate() - 1;
                const productId = products.productId; 
        
       
                if (productQuantities[productId]) {
                 productQuantities[productId]++;
                } else {
                    productQuantities[productId] = 1;
                }
                
                monthData[monthIndex]++; 
                if(products.productStatus=="Delivered"){
                    yearlyDeliverd[monthIndex]++
                    monthDeliverd[monthIndex]++
                    dailyData[dayOfMonth].delivered++;

                }else if(products.productStatus=="Cancel"){
                    monthCancel[monthIndex]++
                    yearlyCancel[monthIndex]++
                    dailyData[dayOfMonth].cancelled++;
                }else if(products.productStatus=='placed'){
                    monthPlaced[monthIndex]++
                    yearlyPlaced[monthIndex]++

                }else if(products.prouductStatus=='Return'){
                    monthRetrun[monthIndex]++
                    yearlyRetrun[monthIndex]++
                    dailyData[dayOfMonth].placed++;
                }
            })
            
            
            
          
        });
        const sortedProducts = Object.entries(productQuantities).sort((a, b) => b[1] - a[1]);
        const topTenProducts = sortedProducts.slice(0, 10);
        
        const topTenProductId = topTenProducts.map(product =>product[0])
        const prouductData = await productDb.find({_id:{$in:topTenProductId}})
       
     
        
       const data = {prouductData,topTenProducts,dailyData,yearlyDeliverd, yearlyCancel , yearlyRetrun ,yearlyData,yearlyPlaced,currentMonthLabel,monthDeliverd,monthCancel,monthRetrun,monthPlaced,paymentMethod}
     
        return data
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
        
    }
}

// const topTenProduct =async(req,res)=>{
//     try {
//      const data=  await orderDb.aggregate([
//         {$unwind:'$products'},
//         {$group:{
//             _id:'$proucts.productId',
//             totalQuantity:{$sum:'$products.quintity'},

//         }},
//        { $sort:{totalQuantity:-1}},
//        {$limit:10}
//        ])
// console.log(data)
//     } catch (error) {
//         console.log(error.message)
        
//     }
// }
// topTenProduct()
module.exports={
    orderPrdouct,
 

}
const orderDb = require("../model/orderDb");


const reportPage=async (req,res)=>{
    try {
       
        const {period}=req.query
        console.log(req.query)
        let startDate, endDate;
        const startOfThisWeek = new Date();
        startOfThisWeek.setHours(0,0,0,0)
        const endOfThisWeek = new Date()

        endOfThisWeek.setDate(endOfThisWeek.getDate()+(7-endOfThisWeek.getDay()))

        endOfThisWeek.setHours(23,59,999)
        switch(period){
            case 'Weekly':{
                startDate = new Date();
                startDate.setDate(startDate.getDate() - startDate.getDay()); 
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); 
                endDate.setHours(23, 59, 59, 999);
                break;
            }
            case 'Monthly':{
                startDate = new Date();
                startDate.setDate(1); 
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999); // End of current month
                break;

            }
            case 'Yearly':{
                startDate = new Date(new Date().getFullYear(), 0, 1); 
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999); 
                break;
            }
            case 'custom':{
                startDate=new Date(req.query.startDate) 
                startDate.setHours(0,0,0,0)
                endDate=new Date (req.query.endDate) 
                break;

            }
        }

        const report =await orderDb.aggregate([
            {
                $match:{
                    date:{$gte:startDate,$lte:endDate}
                }
            },
            {
                $group:{
                    _id:{
                        $week:"$date"
                    },
                    totalOrders:{$sum:1},
                    totalSales:{$sum:'$totalPrice'}
                }
            }
        ]).exec()
        console.log(report)
    const data = await orderDb.find({date:{$gte:startDate,$lte:endDate}}).populate('clientId').populate({path:"products.productId", model:'product'})
        res.render('report',{data,report,reportPeriod:period})
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
        
    }

}



module.exports={
    reportPage

}
const orderDb = require("../model/orderDb");

const reportPage=async (req,res)=>{
    try {
        const startOfThisWeek = new Date();
        startOfThisWeek.setHours(0,0,0,0)
        const endOfThisWeek = new Date()
        endOfThisWeek.setDate(endOfThisWeek.getDate()+(7-endOfThisWeek.getDay()))
        endOfThisWeek.setHours(23,59,999)
        const report =await orderDb.aggregate([
            {
                $match:{
                    date:{$gte:startOfThisWeek,$lte:endOfThisWeek}
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
    const data = await orderDb.find({date:{$gte:startOfThisWeek,$lte:endOfThisWeek}})
    console.log(data)
        res.render('report',{data,report})
        
    } catch (error) {
        
    }

}
module.exports={
    reportPage

}
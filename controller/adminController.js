const clientDb =require('../model/clientDb');

const adminDashboard =async (req,res)=>{
    try {
    res.render('adminDashboard')
    } catch (error) {
        console.log(error.message)
    
    }
}

const logoutadmin =async (req,res)=>{
    try {
        req.session.destroy()
        
        res.redirect('/')
    } catch (error) {
        console.log(error.message)
    }
}


module.exports={
    adminDashboard,
    logoutadmin
}
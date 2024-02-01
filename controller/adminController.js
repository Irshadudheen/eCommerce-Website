const clientDb =require('../model/clientDb');

//ADMIN ADASHBOARD
const adminDashboard =async (req,res)=>{
    try {
    res.render('adminDashboard')
    } catch (error) {
        console.log(error.message)
    
    }
}

//LOGOUTADMIN
const logoutadmin =async (req,res)=>{
    try {
        req.session.destroy()
        
        res.redirect('/')
    } catch (error) {
        console.log(error.message)
    }
}

//SHOW ADMIN THE CLIENT
const clientview = async (req,res)=>{
    try {
        const data = await clientDb.find({is_admin:0})
        res.render('clientview',{data:data})
        
    } catch (error) {
        console.log(error.message)
        
    }
}

//PAGE TO ADMIN FOR THE EDIT CLIENT
const editUser = async (req,res)=>{
    try {
      
       const id=req.query.id
       const clientData= await clientDb.findById({_id:id})

       if(clientData){
           
           res.render('editClient',{client:clientData,id})
       }else{
        res.redirect('/')
       }

        
    } catch (error) {
        console.log(error.message)
    }
}

//EDIT SUBMIT OF CLIENT
const updateClient = async (req,res)=>{
    try {
        const client = req.body.id
        const ClientData= await clientDb.findByIdAndUpdate({_id:client},{$set:{ fname:req.body.name,email:req.body.email,mobile:req.body.mobile }},{new:true})
        if(ClientData){
            res.redirect('/admin/clientview')
        }else{
            res.redirect("/admin/editUser",{message:'there data not update'})
        }
    } catch (error) {
        console.log(error.message)
        
    }
}
//TO DELETE THE  CLIENT
const deleteClient = async (req,res)=>{
    try {       
       const result= await clientDb.deleteOne({_id:req.body.delet})
        console.log(result)
        if(result){

            res.redirect("/admin/clientview")
        }
    } catch (error) {
        console.log(error.message)
        
    }
}



module.exports={
    adminDashboard,
    logoutadmin,
    clientview,
    editUser,
    updateClient,
    deleteClient,
    
}
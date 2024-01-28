const login =async (req,res,next)=>{
    try {
        if(!req.session.user_id){
            res.redirect('/')
        }
        else{
            next()
        }
        
    } catch (error) {
        console.log(error.message)
        
    }
   
}
const logout =async (req,res,next)=>{
    try {
        if(req.session.admin_id){
            res.redirect('/admin/adminWelcome')
        }else if(req.session.user_id){
            res.redirect('/dashboard')
        }
        else{
            next()
        }
        
    } catch (error) {
        console.log(error.message)
        
    }
   
}

const isadminlogin =async (req,res,next)=>{
    try {
        if(!req.session.admin_id){
            res.redirect('/')
        }else{
            next()
        }
        
    } catch (error) {
        console.log(error.message)
        
    }
}


module.exports={
    login,
    logout,
    isadminlogin
}
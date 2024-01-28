const client = require("../model/clientDb")
const bcrypt = require("bcrypt")
const nodemailer =require('nodemailer')



//PASSWORD CONVERTING TO HASH
const securePassword = async (password)=>{
    try {
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash
        
    } catch (error) {
        console.log(error.message)
        
    }
}

//FOR SEND MAIL
const sendOtpMail = async (name,email,otp)=>{
    try {
        console.log(name)
        console.log(email)
        const Transporter =nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:"irshadudheen.p10@gmail.com",
                pass:'kiop xlqt tqio zxwn'
            }
        })
        const mailOption ={
            from:'irshadudheen.p10@gmail.com',
            to:email,
            subject:'For your verification the mail',
            html:'<p>Hi '+name+'the '+otp+' </p>'

        }
        Transporter.sendMail(mailOption,(err,info)=>{
            if(err){
                console.log(err)
            }else(
                console.log("Email has been sent:-"+info.response)
            )
        })
    } catch (error) {
        console.log(error.message)
        
    }
}

const signUpPost= async (req,res)=>{
    try {
        if(/[A-Za-z.]+$/.test(req.body.register_fname)){
            if(/[A-Za-z0-9._%+-]+@gmail.com/.test(req.body.register_email)){

                
                const checkmail= await client.findOne({email:req.body.register_email})
                if(checkmail){
                    console.log('Email is already exsit')
                }else{
                    
                    
                    const sPassword= await securePassword(req.body.register_password)
                    const fname=req.body.register_fname;
                    const lname=req.body.register_lname;
                    const email=req.body.register_email;
                    const mobile=req.body.register_mobile;
                    
                    
                    const Client =  new  client({
                        
                        fname:fname,
                        lname:lname,
                        email:email,
                        password:sPassword,
                        mobile:mobile,
                        is_admin:0
                        
                        
                    })
                    const result = await Client.save()
                    if(result){
                        const otp=Math.floor((Math.random()*1000))+1000
                        console.log(otp)
                        sendOtpMail(fname,email,otp,result._id)
                        res.redirect('/')
                        
                        console.log('register succcc')
                    }else{
                        
                    }
                }
            }else{
                console.log('give the correct structure to the Email')
            }
            }else{
            console.log("give correct structure to the name")
        }
    } catch (error) {
        console.log(error.message)
        
    }
}

//
const login = async (req,res)=>{
    try {
        
        res.render('login')
    } catch (error) {
        console.log(error.massege)
    }
}
//
const loginPost = async (req,res)=>{
    try {
        const email=req.body.singin_email
        const password=req.body.singin_password
      const clientData= await  client.findOne({email:email})
      if(clientData){
        
        
        const passwordMatch = await bcrypt.compare(password,clientData.password)
        if(passwordMatch){
            // if(clientData.is_varified===0){
            //     console.log("verfiy the email")
            // }
            if(clientData.is_admin===true){
                req.session.admin_id=clientData._id
                res.redirect('/admin/adminWelcome')
            }else{

                req.session.user_id=clientData._id
                
                res.redirect('/dashboard')
            }



        }else{
            res.redirect('/')
        }

      }else{
        res.redirect('/')
      }
    } catch (error) {
        console.log(error.message)
    }
}


//
const clientDashboard = async (req,res)=>{
    try {
        
        res.render('index')
    } catch (error) {
        console.log(error.massege)
        
    }
}

//
const logout=async (req,res)=>{
    try {
        req.session.destroy()
        res.redirect('/')
    } catch (error) {
        console.log(error.message)
        
    }
}


//
module.exports={
    clientDashboard,
    login,
    loginPost,
    signUpPost,
    logout
}
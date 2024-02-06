const client = require("../model/clientDb")
const bcrypt = require("bcrypt")
const nodemailer =require('nodemailer')
const clientDb = require("../model/clientDb")
const otpDb = require("../model/otpDb")


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
   console.log(email);
        const Transporter =nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:"irshadudheen.p10@gmail.com",
                pass:'tylm ddnl qpie pjwg'
            }
        })

        const mailOption ={
            from:'irshadudheen.p10@gmail.com',
            to:email,
            subject:'For your verification the mail',
            html:'<p>Hi '+name+' the '+otp+' </p>'

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

//REGISTER THE SUBMIT 
const signUpPost= async (req,res)=>{
    try {
        const {register_fname,register_lname,register_email,register_mobile,register_password}=req.body
        if(/[A-Za-z.]+$/.test(register_fname)){
            if(/[A-Za-z0-9._%+-]+@gmail.com/.test(register_email)){

                
                const checkmail= await client.findOne({register_email})
                if(checkmail){
                    console.log('Email is already exsit')
                }else{
                    
                    
                    const sPassword= await securePassword(register_password)
                    const fname=register_fname;
                    const lname=register_lname;
                    const email=register_email;
                    const mobile=register_mobile;
                    
                    
                    const Client =  new  client({
                        
                        fname,
                        lname,
                        email,
                        password:sPassword,
                        mobile,
                        is_admin:0,
                        is_block:false
                        
                        
                    })
                    const result = await Client.save()
                    if(result){
                        const otp=Math.floor((Math.random()*1000))+1000
                        const otpsave = new otpDb({
                            userId:result._id,
                            emailId:email,
                            otp
                        })
                        const otpResult = await otpsave.save()
                        console.log(otpResult)
                        console.log(otp)
                        sendOtpMail(fname,email,otp,result._id)
                        res.render('otpVerification',{email})
                        

                       
                        
                        console.log('register succcc')
                    }else{
                        
                    }
                }
            }else{
                res.render("login",{message:"give the correct structure to the Email"})

                console.log('give the correct structure to the Email')
            }
            }else{
                res.render("login",{message:"give correct structure to the name"})
            console.log("give correct structure to the name")
        }
    } catch (error) {
        console.log(error.message)
        
    }
}

//LOGIN PAGE
const login = async (req,res)=>{
    try {
        
        res.render('login')
    } catch (error) {
        console.log(error.massege)
    }
}
//LOGIN PAGE SUBMINT
const loginPost = async (req,res)=>{
    try {
        const email=req.body.singin_email
        const password=req.body.singin_password
      const clientData= await  client.findOne({email:email})
      if(clientData){
        
        
        const passwordMatch = await bcrypt.compare(password,clientData.password)
        if(passwordMatch){
            
            if(clientData.is_varified===0){
                console.log("verfiy the email")
            }
            if(clientData.is_varified===true&&clientData.is_block===false){

                if(clientData.is_admin===true){
                    req.session.admin_id=clientData._id
               
                    res.redirect('/admin/adminWelcome')
                }else{
                    
                    req.session.user_id=clientData._id
                    
                    
                    res.redirect('/dashboard')
                }
                
            }else {
                res.render('login',{message:'not verfied'})

            }
            
                
                
            }else{
                res.render('login',{message:'password not correct'})

            
        }

      }else{
        res.render('login',{message:'email and password not correct'})

        
      }
    } catch (error) {
        console.log(error.message)
    }
}


//SHOW THE CLIENT DASHBOARD
const clientDashboard = async (req,res)=>{
    try {
        
        res.render('index')
    } catch (error) {
        console.log(error.massege)
        
    }
}

//CLIENT LOGOUT
const logout=async (req,res)=>{
    try {
        req.session.destroy()
        res.redirect('/')
    } catch (error) {
        console.log(error.message)
        
    }
}

//OTP SUBMIT
const otpSubmit= async (req,res)=>{
    try {
        const email=req.body.email

        const otpVerify= await otpDb.findOne({emailId:email})
        console.log(otpVerify)
        if(otpVerify){
           const inputOtp=req.body.digit1*1000+req.body.digit2*100+req.body.digit3*10+req.body.digit4*1
           console.log(inputOtp)
           if(inputOtp==otpVerify.otp){
            const clientDbUbdate= await client.updateOne({email},{$set:{is_varified:true}})
            if(clientDbUbdate){
                await otpDb.deleteOne({_id:otpVerify._id})
                req.session.user_id=otpVerify.userId
                res.redirect("/dashboard")
            }
        }
    }


                

    
        
    } catch (error) {
        console.log(error.message)
        
    }
}

//CLIENT PROFILE
const profile =async (req,res)=>{
    try {
        res.render('clientProfile')

    } catch (error) {
        console.log(error.message)
        
    }
}

//RESENT OTP
const resendOtp = async (req,res)=>{
    try {
        const {email}=req.query
        
        
        const personData =await client.findOne({email})
        const deleteOtp =  await otpDb.deleteOne({userId:personData._id})
        console.log(deleteOtp)
        const otp=Math.floor((Math.random()*1000))+1000
        console.log(otp)
        const otpUpdate = new otpDb({
            userId:personData._id,
            emailId:email,
            otp
        })
        const dataOtp = await otpUpdate.save()
        if(dataOtp){
            console.log(otp)
        console.log(email)
        if(personData){
        sendOtpMail(personData.fname,email,otp)
        console.log("slkajlkajlakjfaklajkla")
        res.render('otpVerification',{email})
            
        }

        }
        
    } catch (error) {
        console.log(error.message)
        
    }
}

//FORGOT PASSWORD
const forgotPassword = async (req,res)=>{
    try {

        res.render('forgotPasswordPage')
    } catch (error) {
        console.log(error.message)
        
    }
}

//FORGOT PASSWORD SUBMIT
const forgotPasswordSubmit = async (req,res)=>{
    try {
        const {email}=req.body
        console.log(req.body.email)

        const checkmail = await clientDb.findOne({email})
        console.log(checkmail)
        const otp=Math.floor((Math.random()*1000))+1000
        console.log(otp)
        

        if(checkmail){
            const otpUpdate = new otpDb({
                userId:checkmail._id,
                emailId:email,
                otp
            })
            const dataOtp = await otpUpdate.save()
            console.log(dataOtp)

            sendOtpMail(checkmail.name,email,otp)
            console.log(email)

            res.render('forgetOtp',{email})

        }


        
    } catch (error) {
        console.log(error.message)
        
    }
}

//OTPSUBMITFPRGET 
const otpSubmitForgot = async (req,res)=>{
    try {
        
        const {digit1,digit2,digit3,digit4,email}=req.body
        console.log(req.body)
        
        const otpVerify= await otpDb.findOne({emailId:email})
        const inputOtp=digit1*1000+digit2*100+digit3*10+digit4*1
        
        console.log(digit1,digit2)
        console.log(otpVerify)
        console.log("sdjksjkncdn")
        console.log(inputOtp)
        if(otpVerify.otp==inputOtp){
            console.log(email,"aklsdo;ksxklmxlkmesxflkmsfxlnmdfvlkmdklfm,")
            res.render('toSetNewPassword',{email})

            
        }else{
            console.log("the otp is incorrect")
        }


        
    } catch (error) {
        console.log(error.message)
    }
}

//TO UPDATE THE PASSWORD
const passwordUpdate = async (req,res)=>{
    try {
        const {password,email}=req.body
        console.log(req.body)
        const sPassword= await securePassword(password)
        console.log(req.body)

        const update = await clientDb.updateOne({email},{$set:{password:sPassword}})
        console.log(update)
        if(update){
            res.redirect('/')
        }
    } catch (error) {
        console.log(error.message)
        
    }
}

//EXPORT
module.exports={
    clientDashboard,
    login,
    loginPost,
    signUpPost,
    logout,
    otpSubmit,
    profile,
    resendOtp,
    forgotPassword,
    forgotPasswordSubmit,
    otpSubmitForgot,
    passwordUpdate,

  
    
}
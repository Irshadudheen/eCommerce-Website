const client = require("../model/clientDb")
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer')
const clientDb = require("../model/clientDb")
const otpDb = require("../model/otpDb")
const addressDb = require("../model/addressDb")
const orderDb = require('../model/orderDb')
const cartDb = require("../model/cartDb")
const wishlistDb = require("../model/wishlistDb")
const couponDb = require("../model/couponDb")
const walletDb = require('../model/walletDb')

//PASSWORD CONVERTING TO HASH
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash

    } catch (error) {
        console.log(error.message)

    }
}

//FOR SEND MAIL
const sendOtpMail = async (name, email, otp) => {
    try {
        console.log(email);
        console.log(otp)
        const Transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.emailId,
                pass: process.env.password
            }
        })

        const mailOption = {
            from: process.env.emailId,
            to: email,
            subject: 'For your verification the mail',
            html: '<p>Hi ' + name + ' the ' + otp + ' </p>'

        }
        Transporter.sendMail(mailOption, (err, info) => {
            if (err) {
                console.log(err)
            } else (
                console.log("Email has been sent:-" + info.response)
            )
        })
    } catch (error) {
        console.log(error.message)

    }
}

//REGISTER THE SUBMIT 
const signUpPost = async (req, res) => {
    try {
        const { name, email,mobile,password,referralCode } = req.body
        if(referralCode){
            req.session.referralCode=referralCode
        }
        if(!/[A-Za-z.]+$/.test(name)){
            
            req.flash('message','give correct structure to the name')
            return res.redirect('/register')
        }
        if(!/[A-Za-z0-9._%+-]+@gmail.com/.test(email)){
           
            req.flash('message','give the correct structure to the email')
            return res.redirect('/register')

        }
        const checkmail = await clientDb.findOne({ email })
        if (checkmail) {
            req.flash('message','Email is already exsit')
          return  res.redirect('/register')
        } else {
                        const sPassword = await securePassword(password)
                        const Client = new client({
                            username:name,
                            email,
                            password:sPassword,
                            mobile,
                            is_admin: 0,
                            is_block: false,
                        })
                        req.session.ClientData=Client
                        if (Client) {
                            const otp = Math.floor((Math.random() * 1000)) + 1000
                            const otpsave = new otpDb({
                                 emailId:email,
                                otp
                            })
                            const otpResult = await otpsave.save()
                            sendOtpMail(name, email, otp)
                            req.flash('email',email)
                            return  res.redirect('/otpPage')
                        } 
                    }
                
       
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

//LOGIN PAGE
const login = async (req, res) => {
    try {
    const message = req.flash('message')
    res.render('login',{message})
    } catch (error) {
        console.log(error.massege)
        return res.status(500).send("Internal server error");
    }
}
//LOGIN PAGE SUBMINT
const loginPost = async (req, res) => {
    try {
        const {email,password}=req.body
        const clientData = await client.findOne({ $or:[{email},{fname:email}] })
            if(!clientData){
                req.flash('message', 'user is not exist');
                return res.status(302).redirect('/');
            }
            else if(!(await bcrypt.compare(password, clientData.password))) {
                req.flash('message','password not correct')
                return res.status(400).redirect('/')
            }
            else if(clientData.is_block){
                req.flash('message','you are blocked')
               return res.status(400).redirect('/')
            }
            clientData.is_admin ?req.session.admin_id= clientData._id :req.session.user_id= clientData._id;
            console.log('admin:',req.session.admin_id,'user:',req.session.user_id)
            const redirectPath = clientData.is_admin ? '/admin/adminWelcome' : '/dashboard';
            return res.redirect(redirectPath);
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}


//SHOW THE CLIENT DASHBOARD
const clientDashboard = async (req, res) => {
    try {
        const {user_id}=req.session
        let cheackUser=true
        if(!user_id){
            cheackUser=false
        }
        const cart = await cartDb.findOne({clientId:user_id})
        const cartCount = cart?.products.length
            const totalPriceCart = cart?.products.reduce((total, product) => {
                return total + product.totalPrice

            }, 0)
            
        const wishlist = await wishlistDb.findOne({clientId:user_id})
        const wishlistCount = wishlist?.products.length
        console.log(cartCount,"dfujiolefjksdiorekljsdfioerklsdfjoerilsdfjkioerkldfj")
        
        res.render('index',{cartCount,totalPriceCart,wishlistCount,cheackUser})
    } catch (error) {
        console.log(error.massege)
        return res.status(500).send("Internal server error");

    }
}

//CLIENT LOGOUT
const logOut = async (req, res) => {
    try {
       
        req.session.destroy()
      return  res.redirect('/')
    } catch (error) {
        
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

//OTP SUBMIT
const otpSubmit = async (req, res) => {
    try {
        const email = req.body.email

        const otpVerify = await otpDb.findOne({ emailId: email })
        const userData=req.session.ClientData
        console.log(userData)
        if (userData) {
            const inputOtp = req.body.digit1 * 1000 + req.body.digit2 * 100 + req.body.digit3 * 10 + req.body.digit4 * 1
            
            if (inputOtp == otpVerify.otp) {
                const result= await clientDb.create(userData) 
                if (result) {
                    await otpDb.deleteOne({ _id: otpVerify._id })
                    if(req.session.referralCode){
                        const refferdUser = await walletDb.findOneAndUpdate({referralCode:req.session.referralCode},{$inc:{balance:100}},{new:true})
                        if(refferdUser){
                            const newWallet = await walletDb.create({
                                clientId:  result._id,
                                referralCode:`${email}${inputOtp}`,
                                balance: 50
                            });
                            
                            req.session.user_id = result._id
                        
                          return  res.redirect("/dashboard")

                        }
                    }else{

                        
                        const newWallet = await walletDb.create({
                            clientId:  result._id,
                            referralCode:`${email}${inputOtp}`,
                            balance: 0 
                        });
                        
                        req.session.user_id = result._id
                        return  res.redirect("/dashboard")
                    }
                }
            }
        }






    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//CLIENT PROFILE
const profile = async (req, res) => {
    try {
        const { user_id } = req.session
        const userData = await clientDb.findOne({ _id: user_id })
        const address = await addressDb.find({ clientId: user_id }).populate("clientId")
        const order = await orderDb.find({ clientId: user_id }).populate('addressId').sort({date:-1})
        const coupon = await couponDb.find()
        const wallet = await walletDb.findOne({clientId:user_id})
      
      return  res.render('clientProfile', { userData, address, order,coupon,wallet })

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

//RESENT OTP
const resendOtp = async (req, res) => {
    try {
        const { email,forget } = req.query


        const personData = await client.findOne({ email })
        const deleteOtp = await otpDb.deleteOne({ userId: personData._id })
       
        const otp = Math.floor(Math.random() * 9000) + 1000;
     
        const otpUpdate = new otpDb({
            userId: personData._id,
            emailId: email,
            otp
        })
        const dataOtp = await otpUpdate.save()
        if(forget){
            res.render('forgetOtp',{email})
        }else 
        if (dataOtp) {
           
            if (personData) {
                sendOtpMail(personData.fname, email, otp)
                req.flash('email',email)
                return  res.redirect('/otpPage')

            }

        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//FORGOT PASSWORD (show the page)
const forgotPassword = async (req, res) => {
    try {

        res.render('forgotPasswordPage')
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//FORGOT PASSWORD SUBMIT (post)
const forgotPasswordSubmit = async (req, res) => {
    try {
        const { email } = req.body
       

        const checkmail = await clientDb.findOne({  email })
        if(!checkmail){
            res.send({status:false})
        }
        console.log(checkmail,111111111111111111111111111111111111111)
       
        
        
        if (checkmail) {
            const otp = Math.floor(Math.random() * 9000) + 1000;
            const dataOtp = await otpDb.findOneAndUpdate(
                { emailId: email }, 
                { userId: checkmail._id, emailId: email, otp },
                { upsert: true, new: true } 
            );
            console.log(dataOtp)

            sendOtpMail(checkmail.name, email, otp)
            console.log(email)
            if(dataOtp){
                res.send({status:true})
            }else{
                res.send({status:false})

            }

           

        }



    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//otpPage
const forgotOtpPage= async (req,res)=>{
    try {
        const {email}= req.query
        res.render('forgetOtp',{email})
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}
//OTPSUBMITFPRGET 
const otpSubmitForgot = async (req, res) => {
    try {

        const { digit1, digit2, digit3, digit4, email } = req.body

        const otpVerify = await otpDb.findOne({ emailId: email })
        
        const inputOtp = digit1 * 1000 + digit2 * 100 + digit3 * 10 + digit4 * 1

        if (otpVerify.otp == inputOtp) {
            console.log(inputOtp,233333333333333333333333333333333333333333333)
            console.log(email, "aklsdo;ksxklmxlkmesxflkmsfxlnmdfvlkmdklfm,")
            req.flash('email',email)
          return  res.redirect('/otpPage')
            // res.render('toSetNewPassword', { email })


        } else {
            
            console.log("the otp is incorrect")

        }



    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//TO UPDATE THE PASSWORD
const passwordUpdate = async (req, res) => {
    try {
        const { password, email } = req.body
        console.log(req.body)
        const sPassword = await securePassword(password)
        console.log(req.body)

        const update = await clientDb.updateOne({ email }, { $set: { password: sPassword } })
        console.log(update)
        if (update) {
            res.redirect('/')
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

//
const register = async (req, res) => {
    try {
        res.render('register')

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

// checkUserName
const checkUserName = async (req,res)=>{
    try {
        const{input}=req.body
        const checkUsername = await clientDb.findOne({fname:input})
        if(checkUsername){
            res.send({status:false})
        }else{
            res.send({status:true})
        }
    } catch (error) {
        
        console.log(error.message)
        return res.status(500).send("Internal server error");
        
    }
}

//render otp page 
const otpPage = async (req,res)=>{
    try {
        const email = req.flash('email')
        return res.render('otpVerification',{email})
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
        
    }
}

//EXPORT
module.exports = {
    clientDashboard,
    login,
    loginPost,
    signUpPost,
    logOut,
    otpSubmit,
    profile,
    resendOtp,
    forgotPassword,
    forgotPasswordSubmit,
    otpSubmitForgot,
    passwordUpdate,
    register,
    forgotOtpPage,
    checkUserName,
    otpPage
}
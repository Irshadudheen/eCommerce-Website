const express = require('express')
const app =express()
const mongoose = require('mongoose')
const nocache= require('nocache')
const clientRouter = require('./router/clientRouter')
// const session = require('express-session')
// const config = require('./config/config')


app.use(nocache())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
//SESSION CONNETIION
// app.use(session({secret:config.sessionSecret,resave:false,saveUninitialized:false}))

//FOR THE CLIENT ROUTE
const clientRouter = require('./router/clientRouter')
app.use('/',clientRouter)


//MONGODB CONNETTIOIN
mongoose.connect("mongodb://127.0.0.1:27017/eCommereseDb").then(()=>console.log('connected')).catch((err)=>console.log(err))

//ERROR
// app.use((req,res)=>res.status(404).send(404))

//CONNETTION OF SERVER
const PORT=process.env.PORT||3000
app.listen(PORT,()=>console.log(`The server is running ${PORT}`))
const express = require('express')
const mongoose = require('mongoose')
const nocache = require('nocache')
const path = require('path')
const session = require('express-session')
const config = require('./config/config')
const adminRouter = require('./router/adminRouter')
const clientRouter = require('./router/clientRouter')
const app = express()
const dotenv = require('dotenv').config()
const {PORT}= process.env


app.use(nocache())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', 'views/client')
//SET PUBLIC



//SESSION CONNETIION
app.use(session({
    secret: config, resave: false,
    saveUninitialized: false
}))

//FOR THE ADMIN ROUTER
app.use('/admin', adminRouter)

//FOR THE CLIENT ROUTE
app.use('/', clientRouter)


//MONGODB CONNETTIOIN
mongoose.connect("mongodb://127.0.0.1:27017/eCommereseDb").then(() => console.log('connected')).catch((err) => console.log(err))

//ERROR
app.use((req, res) => res.status(404).render('404'))
// app.get('*',(req,res)=>res.status(404).render('404'))

//CONNETTION OF SERVER
app.listen(PORT, () => console.log(`The server is running ${PORT}`))
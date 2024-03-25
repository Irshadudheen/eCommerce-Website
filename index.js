const express = require('express')
const nocache = require('nocache')
const dotenv = require('dotenv').config()
const path = require('path')
const flash = require('express-flash')
const session = require('express-session')
const easyinvoice = require('easyinvoice')
const config = require('./config/config')
const adminRouter = require('./router/adminRouter')
const clientRouter = require('./router/clientRouter')
const app = express()
const {PORT}= process.env

app.use(express.static(path.join(__dirname, "./public")))
app.use(express.static(path.join(__dirname, './public/client')))
app.use(flash())
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

//ERROR



//CONNETTION OF SERVER
app.listen(PORT, () => console.log(`The server is running ${PORT}`))
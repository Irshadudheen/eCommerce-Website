const sessionSecret = 'my site session secret'
const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/eCommereseDb").then(() => console.log('connected')).catch((err) => console.log(err))

module.exports = sessionSecret, mongoose

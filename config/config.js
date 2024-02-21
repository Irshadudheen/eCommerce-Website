const sessionSecret = 'my site session secret'
const mongoose = require('mongoose')
mongoose.connect(process.env.mongodbUrl).then(() => console.log('connected')).catch((err) => console.log(err))

module.exports = sessionSecret, mongoose

//

const clientDb = require("../model/clientDb")

const login = async (req, res, next) => {
    try {

        if (!req.session.user_id) {
          return  res.redirect('/')
        }
        else {
            const checkStatus = await clientDb.findOne({ _id: req.session.user_id, is_block: false })
            
            checkStatus ? next() : req.session.destroy(()=>res.redirect('/'))

            


        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("An error occurred while logging in.");


    }

}

//
const logout = async (req, res, next) => {
    try {
        
        req.session.admin_id ? res.redirect('/admin/adminWelcome') : req.session.user_id ? res.redirect('/dashboard') : next()


    } catch (error) {
        console.log(error.message)

    }

}

//
const isadminlogin = async (req, res, next) => {
    try {
        req.session.admin_id ? next() : res.redirect('/')

    } catch (error) {
        console.log(error.message)

    }
}

//
module.exports = {
    login,
    logout,
    isadminlogin
}
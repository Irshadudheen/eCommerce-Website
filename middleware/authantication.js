//

const clientDb = require("../model/clientDb")

const login = async (req, res, next) => {
    try {

        if (!req.session.user_id) {
            res.redirect('/')
        }
        else {
            const checkStatus = await clientDb.findOne({ _id: req.session.user_id, is_block: false })
            checkStatus ? next() : req.session.destroy()

            if (!req.session) {

                res.redirect('/')
            }


        }

    } catch (error) {
        console.log(error.message)

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
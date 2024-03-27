const clientDb = require('../model/clientDb');
const orderDb = require('../model/orderDb')
const chartController= require('./chartDataController')
//ADMIN ADASHBOARD
const adminDashboard = async (req, res) => {
    try {
        const perPage = 6;
        const currentPage = parseInt(req.query.page, 10) || 1;
        const skip = (currentPage - 1) * perPage;
        const order = await orderDb.find().skip(skip).limit(perPage).populate("clientId").populate({
            path: 'products.productId',
            model: 'product'
        })
        const orderCount = await orderDb.countDocuments()
        const totalPages =Math.ceil(orderCount/perPage) 
       const data = await chartController.orderPrdouct()
   
        res.render('adminDashboard', { order ,data,orderCount,totalPages,currentPage})
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

//LOGOUTADMIN
const logoutAdmin = async (req, res) => {
    try {
        req.session.destroy()

        res.redirect('/')
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//SHOW ADMIN THE CLIENT
const clientView = async (req, res) => {
    try {
        const data = await clientDb.find({ is_admin: 0 })
        res.render('clientview', { data })

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

//PAGE TO ADMIN FOR THE EDIT CLIENT
const editUser = async (req, res) => {
    try {

        const id = req.query.id
        const clientData = await clientDb.findById({ _id: id })

        if (clientData) {

            res.render('editClient', { client: clientData, id })
        } else {
            res.redirect('/')
        }


    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//EDIT SUBMIT OF CLIENT
const updateClient = async (req, res) => {
    try {
        const { id } = req.body
        
        
        const clientemailCheck = await clientDb.findOne({ email:req.body.email })
        if (clientemailCheck._id==id) {

            const ClientData = await clientDb.findByIdAndUpdate({ _id: id }, { $set: { fname: req.body.name, email: req.body.email, mobile: req.body.mobile } }, { new: true })
            if (ClientData) {
                res.redirect('/admin/clientview')
            } else {
                res.render("editClient", { message: 'there data not update' })
            }
        } else {
            res.render("editClient",{message:'the email is already exists',id:req.body.id,client:req.body.client})
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}
//TO DELETE THE  CLIENT
const deleteClient = async (req, res) => {
    try {
        const result = await clientDb.deleteOne({ _id: req.body.delet })
        if (result) {

            res.redirect("/admin/clientview")
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

//TO BLOCK THE CLIENT
const blockClient = async (req, res) => {
    try {
        console.log(req.query.id)

        const { id } = req.query
        const check = await clientDb.findOne({ _id: id })
        check.is_block=!check.is_block
        check.save()

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}


module.exports = {
    adminDashboard,
    logoutAdmin,
    clientView,
    editUser,
    updateClient,
    deleteClient,
    blockClient

}
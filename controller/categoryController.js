
const categoryDb = require('../model/categoryDb')
const clientDb = require('../model/clientDb')


//LOAD THE PAGE ADDCATEGORY
const addCategory = async (req, res) => {
    try {

        res.render('addCategory')
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//SUBMIT THE PAGE OF ADD CCATEGORY
const addCategorySumbit = async (req, res) => {
    try {

        const { name, description } = req.body

        const checkCatogery = await categoryDb.findOne({ name: { $regex: new RegExp("^" + name + "$", "i") } })
        if (!checkCatogery) {





            const category = await categoryDb({
                name,
                description,
                status: true,

            })
            const result = await category.save()
            if (result) {
                res.redirect('/admin/viewCategory')

            }


        } else {
            res.render('addCategory', { message: 'category is already exist' })
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//
const viewCategory = async (req, res) => {
    try {
        const category = await categoryDb.find()
        res.render('viewCategory', { category })

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

const deleteCategory = async (req, res) => {
    try {
        await categoryDb.deleteOne({ _id: req.query.id })
        return res.redirect('/admin/ViewCategory')
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

//EDIT THE CATEGORY
const editCategory = async (req, res) => {
    try {
        const { id } = req.query
        const dataCatogory = await categoryDb.findOne({ _id: id })
        res.render('editCategory', { dataCatogory })

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//
const editCategorySubmit = async (req, res) => {
    try {
        const { id, name, description } = req.body
        const checkdata = await categoryDb.findOne({ name: { $regex: new RegExp('^' + name + "$", "i") } })
        if (checkdata==null) {


            const categoryUpdate = await categoryDb.updateOne({ _id: id }, { $set: { name, description } })

          return  res.send({ status: true })


         


        }else if(checkdata._id==id){
            const categoryUpdate = await categoryDb.updateOne({ _id: id }, { $set: { name, description } })

          return  res.send({ status: true })

        } else {
            res.send({ status: false,message: "the catogory is already exists" })
    
        }



    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");

    }
}

//STATUS CATEGORY
const statusCategory = async (req, res) => {
    try {
        const { name } = req.body
        console.log(name)
        const checkCatogery = await categoryDb.findOne({ name })
        if (checkCatogery.status == true) {
            const statusCategory = await categoryDb.updateOne({ name }, { $set: { status: false } })
            if (statusCategory) {
                res.send({ status: false })


            }

        } else {
            const statusCategory = await categoryDb.updateOne({ name }, { $set: { status: true } })
            if (statusCategory) {
                res.send({ status: true })
            }

        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}


module.exports = {
    addCategory,
    addCategorySumbit,
    viewCategory,
    deleteCategory,
    editCategory,
    editCategorySubmit,
    statusCategory



}
const addressDb = require('../model/addressDb')
const clientDb = require('../model/clientDb')

const addNewAddress = async (req, res) => {
    try {
        const { country, streetAddress, city, state, pincode, mobile } = req.body
        const { user_id } = req.session
        const pincodeArray = pincode.toString().split('')
        const digitsArray = mobile.toString().split('');



        const address = await addressDb({
            clientId: user_id,
            country,
            streetAddress,
            city,
            state,
            pincode,
            mobile


        })
        const result = await address.save()
        if(req.query.checkout){
            return res.redirect('/checkOut')
        }
        if (result) {
            console.log(result)
            res.redirect('/profile')
        } else {
            console.log("errr")
        }



    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

//
const editProfile = async (req, res) => {
    try {
        const { country, streetAddress, city, state, pincode, mobile } = req.body
        const { id } = req.query
        const mobileMakeArray = mobile.toString().split('')
        const pincodeMakeArray = pincode.toString().split('')
        if (mobileMakeArray.length == 10 && pincodeMakeArray.length == 6) {
            const updateAddress = await addressDb.findByIdAndUpdate({ _id: id }, { $set: { country, streetAddress, city, state, pincode, mobile } }, { new: true })
            if (updateAddress) {
                res.redirect('/profile')
            }
        } else {
            console.log(' number length not correct')
        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

const deleteTheAddress = async (req, res) => {
    try {
        const { id } = req.body
        const removeAddress = await addressDb.deleteOne({ _id: id })
        if (removeAddress) {
            res.send({ status: true })
        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).send("Internal server error");
    }
}

module.exports = {
    addNewAddress,
    editProfile,
    deleteTheAddress
}
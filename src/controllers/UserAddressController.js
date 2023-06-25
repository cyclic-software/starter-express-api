const UserAddress = require("../models/UserAddress")
const User = require("../models/User")
const jwt = require('jsonwebtoken')

const viewUserAddress = (req, res, next) => {
    try{
        const usertoken = req.headers.authorization;
        const token = usertoken.split(' ');
        const decoded = jwt.verify(token[1], process.env.JWT_KEY);
        const id = decoded.id;

        User.findById(id)
            .then(user => {
                UserAddress.findOne({user_id: user._id})
                    .then(respone => {
                        res.json({
                            respone
                        })
                    })
                    .catch(error => {
                        res.json({
                            message: 'An error Occured!'
                        })
                    })
            })
            .catch(error => {
                res.json({
                    message: 'An error Occured!'
                })
            })
    }catch (error) {
        res.json({
        message: "Error"
        })
    }
}

const createUserAddress = async (req, res) => {
    try{
        const usertoken = req.headers.authorization;
        const token = usertoken.split(' ');
        const decoded = jwt.verify(token[1], process.env.JWT_KEY);
        const id = decoded.id;

        const body = req.body;
  
        let userAddress = new UserAddress({
            user_id: id,
            address_line1: body.address_line1,
            address_line2: body.address_line2,
            city: body.city,
            postal_code: body.postal_code,
            country: body.country,
            telephone: body.telephone,
            mobile: body.mobile,
        })
        userAddress.save()
            .then(response => {
                res.json({
                message: "Add address is successfully"
                })
            })
    }catch(error){
        res.json({
            message: "Error"
        })
    }
}

const updateUserAddress = async (req, res) => {
    try{
        const body = req.body;
        let update = {
            address_line1: body.address_line1,
            address_line2: body.address_line2,
            city: body.city,
            postal_code: body.postal_code,
            country: body.country,
            telephone: body.telephone,
            mobile: body.mobile,
        }

    UserAddress.findByIdAndUpdate(body.id, { $set: update })
        .then(()=> {
            res.json({
                message: 'User address updated successfully'
            })
        })
        .catch(error => {
            console.log(error);
            res.json({
    
            message: 'An error Occured!'
            })
        })
    }catch (error) {
        res.json({
            message: "Error"
        })
    }
}

const deleteUserAddress = (req, res, next) => {
    try{
        const body = req.body
        UserAddress.findByIdAndRemove(body.id)
            .then(respone => {
                res.json({
                    message: 'User address deleted successfully'
                })
            })
            .catch(error => {
                res.json({
                    message: 'An error Occured!'
                })
            })
    }catch (error) {
      res.json({
        message: "Error"
      })
    }
}

module.exports = {
    viewUserAddress, createUserAddress, updateUserAddress, deleteUserAddress
}
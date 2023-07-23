const UserPayment = require("../models/UserPayment")
const User = require("../models/User")
const jwt = require('jsonwebtoken');

const viewUserPayment = (req, res, next) => {
    try{
        const usertoken = req.headers.authorization;
        const token = usertoken.split(' ');
        const decoded = jwt.verify(token[1], process.env.JWT_KEY);
        const id = decoded.id;

        User.findById(id)
            .then(user => {
                UserPayment.findOne({user_id: user._id})
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

const createUserPayment = async (req, res) => {
    try{
        const usertoken = req.headers.authorization;
        const token = usertoken.split(' ');
        const decoded = jwt.verify(token[1], process.env.JWT_KEY);
        const id = decoded.id;

        const body = req.body;
  
        let userPayment = new UserPayment({
            user_id: id,
            payment_type: body.payment_type,
            provider: body.provider,
            account_no: body.account_no,
            expiry: body.expiry,
        })
        userPayment.save()
            .then(response => {
                res.json({
                message: "Add payment is successfully"
                })
            })
    }catch(error){
        res.json({
            message: "Error"
        })
    }
}

const updateUserPayment = async (req, res) => {
    try{
        const body = req.body;
        let update = {
            payment_type: body.payment_type,
            provider: body.provider,
            account_no: body.account_no,
            expiry: body.expiry,
        }

    UserPayment.findByIdAndUpdate(body.id, { $set: update })
        .then(()=> {
            res.json({
                message: 'User payment updated successfully'
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

const deleteUserPayment = (req, res, next) => {
    try{
        const body = req.body
        UserPayment.findByIdAndRemove(body.id)
            .then(respone => {
                res.json({
                    message: 'User Payment deleted successfully'
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
    viewUserPayment, createUserPayment, updateUserPayment, deleteUserPayment
}
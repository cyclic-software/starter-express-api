const User = require("../models/User")
const bcrypt = require("bcrypt")
const { hashSync, genSaltSync } = require("bcrypt");
const jwt = require('jsonwebtoken')
require("dotenv").config();

const viewProfile = (req, res, next) => {
    try{
        const usertoken = req.headers.authorization;
        const token = usertoken.split(' ');
        const decoded = jwt.verify(token[1], process.env.JWT_KEY);
        const id = decoded.id;

        User.findById(id)
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
    }catch (error) {
        res.json({
        message: "Error"
        })
    }
}

const signUp = async (req, res) => {
    try{
        const body = req.body;
        const isNewUser = await User.isThisEmailUse(body.email)
        if(!isNewUser){
            return res.json({
                message: 'This email is already in use'
            })
        }

        const salt = genSaltSync(10);

        try {
            body.password = hashSync(body.password, salt);
        } catch (error) {
            res.json({
                message: "password error"
            })
        }

        let user = new User({
            username: body.username,
            email: body.email,
            password: body.password,
            first_name: body.first_name,
            last_name: body.last_name,
            telephone: body.telephone
        })
        user.save()
        .then(response => {
            res.json({
            message: "Sign up is successfully"
            })
        })
    }catch(error){
        res.json({
            message: "Error"
        })
    }
}

const updateProfile = async (req, res) => {
    try{
        const usertoken = req.headers.authorization;
        const token = usertoken.split(' ');
        const decoded = jwt.verify(token[1], process.env.JWT_KEY);
        const id = decoded.id;

        const body = req.body;
        let update = {
            first_name: body.first_name,
            last_name: body.last_name,
            telephone: body.telephone,
        }
        User.findByIdAndUpdate(id, { $set: update })
            .then(()=> {
                res.json({
                message: 'User updated successfully'
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

const deleteProfile = (req, res, next) => {
    try{
        const usertoken = req.headers.authorization;
        const token = usertoken.split(' ');
        const decoded = jwt.verify(token[1], process.env.JWT_KEY);
        const id = decoded.id;

        User.findByIdAndRemove(id)
        .then(respone => {
            res.json({
                message: 'User deleted successfully'
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

const login = async(req, res, next) => {
    try{
        var email = req.body.email
        var password = req.body.password
        const isNewUser = await User.isThisEmailUse(email)
        if (isNewUser) {
            return res.json({
                message: 'Id or password is invalid'
            })
        }
        User.findOne({$or: [{email: email}, {password: password}]})
            .then(user => {
                if(user){
                    bcrypt.compare(password, user.password, function(err, result){
                        if(err){
                            res.json({
                                error: err
                            })
                        }

                        if(result){
                            let token = jwt.sign({email:user.email, id: user._id}, process.env.JWT_KEY)
                            res.json({
                                message: 'Login Successful!',
                                token: token,
                            })
                        }else{
                            res.json({
                                message: "Id or password is invalid"
                            })
                        }
                    })
                }else{
                    res.json({
                        message: 'No User'
                    })
                }
            })
    }catch (error) {
        res.json({
          message: "Error"
        })
    }
}

module.exports = {
    viewProfile, signUp, updateProfile, deleteProfile, login
}
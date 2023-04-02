const User = require('../models/Users')
const Employee = require('../models/Employees')
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { response } = require('express');

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    let creationdate = new Date();
    body.password = hashSync(body.password, salt);
    if (typeof body.user_id === "number") {
      let user = new User({
        user_id: body.user_id,
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
        password: body.password,
        birth_day: body.birth_day,
        phone: body.phone,
        mobile: body.mobile,
        level:body.level,
        join_date: creationdate,
        last_login: creationdate,
        NAT_id: body.NAT_id,
        address: body.address,
        HS_score: body.HS_score
      })
      user.save()
        .then(response => {
          res.json({
            message: "User added successfully"
          })
        })
    }
    else {
      let employee = new Employee({
        user_id: body.user_id,
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
        password: body.password,
        birth_day: body.birth_day,
        phone: body.phone,
        mobile: body.mobile,
        join_date: creationdate,
        last_login: creationdate,
        NAT_id: body.NAT_id,
        address: body.address,
        admin:body.admin
      })
      employee.save()
        .then(response => {
          res.json({
            message: "User added successfully"
          })
        })
    }
  },
  login: async (req, res) => {
    const body = req.body;
    const { user_id, password } = req.body;
    let requester;
    if (typeof user_id === "number")
      requester = await User.findOne({ user_id: user_id });
    else
      requester = await Employee.findOne({ user_id: user_id });
    if (!requester)
      return res.json({ msg: "Incorrect username or password", status: false });
    const result = compareSync(password, requester.password);
    if (!result)
      return res.json({ msg: "Incorrect username or password", status: false });
    else {
      requester.password = undefined
      const jsontoken = sign({ result: requester }, process.env.JWT_KEY)
      return res.json({
        success: 1,
        message: "login successfully",
        token: jsontoken
      });
    }
  },
  getUserByUserId: (req, res) => {
    const id = req.params.id;
    if (typeof user_id === "number")
      user = User.findOne({ user_id: user_id });
    else
      user = Employee.findOne({ user_id: user_id });
    if (user) {
      user.password = undefined;
      return res.json({
        success: 1,
        data: user
      })
    }
    else {
      return res.json({
        success: 0,
        message: "Record not Found"
      });

    }
  },
  getStudents: async (req, res) => {
    let users = await User.find()
    for (user in users)
      user.password = undefined
    return res.json({
      success: 1,
      data: users
    });
  },
  updateUsers: (req, res) => {
    const body = req.body;
    let _id = body._id
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    if (typeof body.user_id === "number") {
      let newset = {
        user_id: body.user_id,
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
        password: body.password,
        phone: body.phone,
        level:body.level,
        mobile: body.mobile,
        NAT_id: body.NAT_id,
        address: body.address,
        HS_score: body.HS_score
      }
      User.findByIdAndUpdate(_id, { $set: newset })
        .then(respone => {
          res.json({
            message: 'user updated successfully'
          })
        })
        .catch(error => {
          console.log(error);
          res.json({
            
            message: 'An error Occured!'
          })
        })
    }
    else {
      let newset ={
        user_id: body.user_id,
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
        password: body.password,
        birth_day: body.birth_day,
        phone: body.phone,
        mobile: body.mobile,
        NAT_id: body.NAT_id,
        address: body.address,
        admin:body.admin
      }
      User.findByIdAndUpdate(_id, { $set:employee })
        .then(respone => {
          res.json({
            message: 'Employee updated successfully'
          })
        })
        .catch(error => {
          res.json({
            message: 'An error Occured!'
          })
        })
    }
  },
  deleteone: (req, res) => {
    let id = req.body.id
    if (typeof req.body.user_id === "number") {
      Employee.findByIdAndDelete(id)
        .then(respone => {
          res.json({
            message: 'Employee deleted successfully'
          })
        })
        .catch(error => {
          res.json({
            message: 'An error Occured!'
          })
        })
    }
    else {
      Employee.findByIdAndDelete(id)
        .then(respone => {
          res.json({
            message: 'Employee deleted successfully'
          })
        })
        .catch(error => {
          res.json({
            message: 'An error Occured!'
          })
        })

    }
  },

}
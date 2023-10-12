import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authhelpers.js";
import JWT from "jsonwebtoken";

export const registerController=async (req,res)=>{ 
    try{
      const {name,email,password,number,role}=req.body
  
      //existing user
      const existingUser=await userModel.findOne({email})
      if(existingUser){
          return res.status(200).send({
              success:true,
              message:"Already registered please login"
          })
      }
      //register
      const hashedPassword=await hashPassword(password)
      console.log(hashedPassword)
      const newuser =await new userModel({name,email,password:hashedPassword,number,role}).save().then(
          res.status(200).send({
          success:true,
          message:"registered",
      }))
    } catch(err){
      console.log(err)
      res.status(500).send({
          success:false,
          message:"registration failed",
          err
      })
    }
  };

  //login controller

  export const loginController = async (req,res)=>{
    try {
     const {email,password}=req.body
     const user=await userModel.findOne({email})
     if(!user){
       return res.status(200).send({
         success:false,
         message:"No user found"
       })
     }
     const match=await comparePassword(password,user.password)
     if(!match){
       return res.status(200).send({
         success:false,
         message:"Invalid Password"
       })
     } 
     const token =  JWT.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})
     res.send({
       success:true,
       message:"loggin successfull",
       token,
       user:{ 
       id:user._id,
       name:user.name,
       email:user.email,
       number:user.number,
       role:user.role?user.role:"0"
       }
     })
      } catch (error) {
       console.log(error)
     return res.status(500).send({
       success:false,
       message:"login failed"
     }) 
    }
 }
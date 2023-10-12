import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authhelpers.js";

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
import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
     name:{
       type:String,
       required:true,
       trim:true
     },
     email:{
        type:String,
        required:true,
        unique:true
     },
     password:{
        type:String,
        required:true,
     },
     number:{
        type:String,
        required:true,
     },
     role:{
        type:String
     }
})

export default mongoose.model('users',userSchema)
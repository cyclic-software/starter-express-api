import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const createUser = async(req,res)=>{

    try {
        const user =await User.create(req.body)
        res.status(201).json({user:user._id})
    } catch (error) {
        console.log("error",error)

        let errors2 = {};

        if(error.keyPattern.username===1){
            errors2.username = 'this username is already registered'
        }
        if(error.keyPattern.email===1){
            errors2.email = 'this email is already registered'
        }
        

        if(error.name==="ValidationError"){
            Object.keys(error.errors).forEach((key)=>{
                errors2[key]=error.errors[key].message;
            })
        }

        console.log("errors 2", errors2)

        res.status(400).json(errors2)
    }
   
};

const loginUser =  async(req,res)=>{

    try {
        const {username ,password} = req.body;

        const user =await  User.findOne({username:username});
        
        let same = false;

        if(user){
            same = await bcrypt.compare(password,user.password)
        }
        else{
            return res.status(401).json({
                succeded:false,
                error: "bele bir istifadeci yoxdu"
            })
        }
        
        if(same){

            const token = createToken(user._id); 
            res.cookie("jwt",token,{
                httpOnly:true,
                maxAge:1000*60*60,
            })

            res.redirect("/users/dashboard");
        }
        else{
            res.status(401).json({
                succeded:false,
                error: "password yanlisdir"
            })
        }


    } catch (error) {
        res.status(500).json({
            succeded:false,
            error
        })
    }
   
};

const createToken = (userId) =>{
    return jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"1d"
    })
}



const getDashboardPage =  (req,res)=>{
   
       
        res.status(200).render("dashboard",{
           
            link:"dashboard"
        });
 
}
export {createUser,loginUser,getDashboardPage} ;


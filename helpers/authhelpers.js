import bcrypt from "bcrypt"

export const hashPassword = async (password)=>{
    try{
   const saltRounds=4;
   const hashedPassword=await bcrypt.hash(password,saltRounds)
   return hashedPassword;
    } catch(err){
        console.log(err)
    }
}

export const comparePassword = async (password,hashedPassword)=>{
    try{
     return bcrypt.compare(password,hashedPassword)
    } catch(err){
        console.log(err)
    }
}
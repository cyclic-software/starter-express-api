import mongoose from "mongoose";


const conn = ()=>{
    mongoose.connect(process.env.DB_URI,{
        dbName: "damv",
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(()=>{
        console.log("connected damv db")
    }).catch((err)=>{
        console.log("error verdi",err)
    })
}

export default conn;
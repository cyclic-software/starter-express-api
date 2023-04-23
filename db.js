import mongoose from "mongoose";

const conn  = ()=>{
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DB_URI,{
        dbName: "damvev",
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }).then(()=>{
        console.log("connected to db succesful")
    }).catch((err)=>{
        console.log(`db connection error  ${err}`)
    });
};

export default conn;
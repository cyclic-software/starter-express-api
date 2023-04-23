import express from  "express";
import dotenv from "dotenv";
import conn from "./db.js";
import cookieParser from "cookie-parser";
import pageRoute from "./routes/pageRoute.js";
import slideRoute from "./routes/slideRoute.js";
import userRoute from "./routes/userRoute.js";
import projectRoute from "./routes/projectRoute.js";
import { checkUser } from "./middlewares/authMiddleware.js";
import fileUpload from "express-fileupload";
import {v2 as cloudinary} from "cloudinary";
import aboutRote from './routes/homePageRoute/aboutRoute.js'; 

import adminRoute from "./areas/admin/routes/adminRoute.js"

//.enc
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET,
    // secure:true
})

//connection to do db
conn(); 



const app = express();
const port = process.env.PORT; 

// ejs template engine
app.set('view engine','ejs');



// static files midlware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(fileUpload({useTempFiles:true}))

//routes
app.use("*",checkUser);
app.use("/",pageRoute);   
app.use("/slide",slideRoute);
app.use("/users",userRoute);
app.use("/projects",projectRoute);
app.use('/homeAbout',aboutRote);
app.use("/aadmin",adminRoute)


// app.get("/",(req,res)=>{
//     res.render('index');
// })

// app.get("/about",(req,res)=>{
//     res.render('about');
// })

app.listen(port,()=>{
    console.log(` applikasyamizin islediyi port : ${port}`);
});
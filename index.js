import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import morgan from "morgan"
import { authRouter } from "./routes/authRoutes.js"

//import path from "path"
// import { fileURLToPath } from "url"
// import { dirname } from "path"

dotenv.config()
const app = express()
const port=process.env.PORT||5000
// const __filename=fileURLToPath(import.meta.url);
// const __dirname=dirname(__filename)

// app.use(express.static(path.join(__dirname,"./client/build")))
// app.get("/",function(req,res){
//     res.sendFile(path.join(__dirname,"./client/build/index.html"))
// })

//middlewares
app.use(morgan("dev"))
app.use(express.json())

//routes
app.use("/api/v1/auth",authRouter)


app.get('/', (req, res) => {
    console.log("Just got a request!")
    res.send("hey")
})
app.listen(port,async ()=>{
    await connectDb();
    console.log(`server on port ${port}`)
})
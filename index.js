import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const app = express()
const port=process.env.PORT||5000
const __filename=fileURLToPath(import.meta.url);
const __dirname=dirname(__filename)
app.get('/', (req, res) => {
    console.log("Just got a request!")
    res.sendFile(path.join(__dirname,"./client/index.html"))
})
app.listen(port,()=>{
    console.log(`server on port ${port}`)
})
import express from "express"
import path from "path"

const app = express()
const port=process.env.PORT||5000
app.get('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.listen(port,()=>{
    console.log(`server on port ${port}`)
})
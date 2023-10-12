import express from "express"
const app = express()
const port=process.env.PORT||5000
app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.listen(port,()=>{
    console.log(`server on port ${port}`)
})
const express = require('express')
const app = express()

const server=require('http').Server(app)
const io=require('socket.io')(server)

io.on('connection', function (socket) {
    console.log('a user is connected');
    socket.on('chat-message', function (msg) {
        console.log('message is :', msg);
        io.emit('chat-message', msg)
    })
})

app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yoooo!')
})
app.get('/test',(req,res)=>{
    res.status(200).send('hello')
})
server.listen(process.env.PORT || 3000)

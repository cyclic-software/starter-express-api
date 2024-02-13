const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server);
const host = '192.168.1.36'

io.on('connection', function (socket) {
    console.log('a user is connected');
    socket.on('chat-message', function (msg) {
        console.log('message is :', msg);
        io.emit('chat-message', msg)
    })
})

server.listen(9000, () => console.log('listening at 9000'))
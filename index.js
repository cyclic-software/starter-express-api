const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.set("view engine","ejs");

app.use(express.static("public"));

const port = 3000;

app.get("/", function(req,res) {
    res.render("index");
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('pixel upload', (msg) => {
        
       
        io.emit('pixel upload', msg);
    });

    
});

server.listen(port,() => {
    console.log("Server Açıldı! Port: " + port);
});
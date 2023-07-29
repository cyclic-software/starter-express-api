// server.js
const http = require('http');
const socketIO = require('socket.io');

const server = http.createServer();
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('A client connected.');

  socket.on('message', (data) => {
    console.log('Received message:', data);
    // You can perform any actions you need with the data received from Python.
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected.');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

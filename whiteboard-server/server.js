const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Prepare for all drawing data saved
let whiteboardData = [];

io.on('connection', (socket) => {
  console.log('New client connected');

  // Send the shape history to the newly connected client
  socket.emit('history', whiteboardData);

  socket.on('drawing', (data) => {
    // Save the drawing data to the history
    whiteboardData.push(data);

    // Broadcast the entire data object, including the points
    socket.broadcast.emit('drawing', data);
  });

  // Listen for the clearCanvas event and broadcast it to all users
  socket.on('clearCanvas', () => {
    whiteboardData = [];
    socket.broadcast.emit('clearCanvas');
  });


  socket.on('disconnect', () => console.log('Client disconnected'));
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

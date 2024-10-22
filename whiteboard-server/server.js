const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    // origin: ["https://collab-whiteboard.up.railway.app/", "localhost:3000/"],
    origin: "*", // Allow requests from any origin
    methods: ["GET", "POST"]
  }
});

// Prepare for all drawing data saved
let whiteboardData = [];
let currentClient = 0;
let peakClient = 0;

io.on('connection', (socket) => {
  currentClient += 1;
  peakClient = peakClient > currentClient ? peakClient : currentClient;
  console.log(`[ + ] Client. Current: ${currentClient}. Peak: ${peakClient}.`);

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


  socket.on('disconnect', () => {
    currentClient -= 1;
    console.log(`[ - ] Client. Current: ${currentClient}. Peak: ${peakClient}.`);
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

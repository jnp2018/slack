const express = require('express');
const http = require('http');
const WebSocket = require('ws');
// const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     // origin: ["https://collab-whiteboard.up.railway.app/", "localhost:3000/"],
//     origin: "*", // Allow requests from any origin
//     methods: ["GET", "POST"]
//   }
// });
const wss = new WebSocket.Server({ server })

//only client has one of these origin will be able to establish connection to server
const allowedOrigin = [
  "https://collab-whiteboard.up.railway.app/",
  "http://localhost:3000/",
  "http://localhost:3001/"
]

// Prepare for all drawing data saved
let whiteboardData = [];
let currentClient = 0;
let peakClient = 0;

wss.on('connection', (ws) => {

  currentClient += 1;
  peakClient = peakClient > currentClient ? peakClient : currentClient;
  console.log(`[ + ] Client. Current: ${currentClient}. Peak: ${peakClient}.`);

  // Send the shape history to the newly connected client
  socket.emit('history', whiteboardData);

  //Handle Login
  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    socket.join(roomId);
    socket.emit("userIsJoined", { success: true });
  });

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


  ws.on('close', () => {
    currentClient -= 1;
    console.log(`[ - ] Client. Current: ${currentClient}. Peak: ${peakClient}.`);
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

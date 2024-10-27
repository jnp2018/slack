import express from 'express';
import { createServer } from 'http';
import { Server, OPEN } from 'ws';
// const socketIo = require('socket.io');

const app = express();
const server = createServer(app);
// const io = socketIo(server, {
//   cors: {
//     // origin: ["https://collab-whiteboard.up.railway.app/", "localhost:3000/"],
//     origin: "*", // Allow requests from any origin
//     methods: ["GET", "POST"]
//   }
// });
const wss = new Server({ server })

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

//! Main --------------------------------------------
wss.on('connection', (ws) => {

  currentClient += 1;
  peakClient = peakClient > currentClient ? peakClient : currentClient;
  console.log(`[ + ] Client. Current: ${currentClient}. Peak: ${peakClient}.`);

  // New client is sent whiteboard data for sync with others
  // socket.emit('history', whiteboardData);
  wsSend(ws, "history", whiteboardData)

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

  ws.on('message', (message) => {
    console.log(`Received message =>_${message}_<=`);
    switch (message.tag) {
      case 'roomCreateRequest':
        //TODO: room create request handler
        break;
      case 'userJoinRequest':
        //TODO: user join request
        break;
      case 'userJoined':
        //TODO
        break;
      case 'drawing':
        break;
      case 'clearCanvas':
        //TODO
        break;
      case 'undo':
        //TODO
        break;
      case 'redo':
        //TODO
        break;
      //TODO: add more case here
      default:
        console.log('Unknown message tag:', message.tag);
        break;

    }
  })


  ws.on('close', () => {
    currentClient -= 1;
    console.log(`[ - ] Client. Current: ${currentClient}. Peak: ${peakClient}.`);
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//! Handlers --------------------------------------------



//! Utilities --------------------------------------------
//send the message to everyone currently connect to server
const broadcast = (ws, msg) => {
  wss.clients.forEach((client) => {
    if (client.readyState === OPEN) {
      client.send(JSON.stringify(msg));
    }
  });
}

//basic send function
const wsSend = (ws, tag, data) => {
  ws.send(JSON.stringify({ tag: tag, data: data }))
}
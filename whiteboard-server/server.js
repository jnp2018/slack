const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
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

//! Main --------------------------------------------
wss.on('connection', (ws, req) => {

  // Check if ws origin is allowed to connect
  if (!allowedOrigin.includes(req.headers.origin)) {
    wsSend(ws, 'originBlocked', {})
    ws.close()
  }

  currentClient += 1;
  peakClient = peakClient > currentClient ? peakClient : currentClient;
  console.log(`[ + ] Client. Current: ${currentClient}. Peak: ${peakClient}.`);

  // New client is sent whiteboard data for sync with others
  // socket.emit('history', whiteboardData);
  wsSend(ws, "history", whiteboardData)


  ws.on('message', (message) => {
    console.log(`Received message =>_${message}_<=`);
    switch (message.tag) {
      case 'roomCreateRequest':
        //TODO: room create request handler
        break;
      case 'userJoinRoomRequest':
        handleUserJoinRequest(ws, message.data)
        break;
      case 'userJoinedRoom':
        //TODO: user joined room handler
        break;
      case 'drawing':
        drawingHandler(ws, message.data)
        break;
      case 'clearCanvas':
        clearCanvasHandler(ws, message.data)
        break;
      case 'undo':
        //TODO: undo handler
        break;
      case 'redo':
        //TODO: redo handler
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
//Handle Login
// socket.on("userJoined", (data) => {
//   const { name, userId, roomId, host, presenter } = data;
//   socket.join(roomId);
//   socket.emit("userIsJoined", { success: true });
// });
const handleUserJoinRequest = (ws, data) => {
  const { roomId, userId } = data;
  
  if (true) {
    //TODO: resolve request logic for accept/reject at handleUserJoinRequest
  // Default respond: always Accept
  wsSend(ws, 'userJoinRoomRequestAccepted', {})
  } else {
    wsSend(ws, 'userJoinRoomRequestRejected', {})
  }
  



}

const drawingHandler = (ws, data) => {
  // Save the drawing data to the history
  whiteboardData.push(data);
  // Broadcast the entire data object, including the points
  broadcast(ws, 'drawing', data)
}

const clearCanvasHandler = (ws, data) => {
  // Clear the whiteboard data
  whiteboardData = [];
  broadcast(ws, 'clearCanvas', data)
}


//! Utilities --------------------------------------------
//send the message to everyone currently connect to server
const broadcast = (ws, tag, data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === OPEN) {
      client.send(JSON.stringify({ tag: tag, data: data }));
    }
  });
}

//basic send function
const wsSend = (ws, tag, data) => {
  ws.send(JSON.stringify({ tag: tag, data: data }))
}
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server })

//only client has one of these origin will be able to establish connection to server
const allowedOrigin = [
  "https://collab-whiteboard.up.railway.app",
  "http://localhost:3000",
  "http://localhost:3001"
]

// Prepare for all drawing data saved
let whiteboardList = [
  {
    id: 'f0d82725-9cb9-43df-ae5e-c86c148db92d',
    whiteboardData: [],
    name: 'Whiteboard 0',
    users: [
      {
        id: '4674f88b025b4c0d0f90fac016bed637',
        name: 'User 0',
        roles: [
          'admin',
          'verified'
        ]
      }
    ]
  }
]
let whiteboardData = [];
let currentClient = 0;
let peakClient = 0;

//! Main --------------------------------------------
wss.on('connection', (ws, req) => {

  // TODO: handle origin auth
  if (!allowedOrigin.includes(req.headers.origin)) {
    wsSend(ws, 'originBlocked', {})
    console.log('this origin is blocked :' +req.headers.origin)
    ws.close()
  } else {
    console.log('nice origin bro :' + req.headers.origin)
  }

  //TODO: handle name
  wsExtend(ws, generateUserId(), 'no name yet')
  console.log(ws.id, ws.name)
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
//! WebSocket extender --------------------------------------------
const wsExtend = (ws, id, name) => {
  ws.id = id;
  ws.name = name;
  ws.assignToRoom = (roomId) => {
    // Add user id to wb memo
    whiteboardList.find(wb => wb.id === roomId).users.push(ws.id)
  }

  ws.removeFromRoom = (roomId) => {
    // Remove user id from memo
    whiteboardList.find(wb => wb.id === roomId).users
      = whiteboardList.find(wb => wb.id === roomId).users.filter(user => user.id !== ws.id)
  }
  //TODO: move broadcast and wsSend here
  //TODO: add more function here
  
}

//! Utilities --------------------------------------------

const generateUserId = () => {
  return crypto.randomBytes(16).toString('hex'); // Generates a 32-character hex string e.g. 4674f88b025b4c0d0f90fac016bed637
}

const generateRoomId = () => {
  return crypto.randomUUID(); // Generates a UUID v4-style ID e.g. f0d82725-9cb9-43df-ae5e-c86c148db92d
}

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
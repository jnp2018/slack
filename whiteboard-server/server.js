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
      }
    ]
  }
]
let currentClient = 0;
let peakClient = 0;

//! Main --------------------------------------------
wss.on('connection', (ws, req) => {

  // TODO: handle origin auth
  if (!allowedOrigin.includes(req.headers.origin)) {
    wsSend(ws, 'originBlocked', {})
    console.log('this origin is blocked :' + req.headers.origin)
    ws.close()
  } else {
    console.log('nice origin bro :' + req.headers.origin)
  }

  //TODO: handle name
  wsExtend(ws, generateUserId(), 'guest user')
  console.log(ws.id, ws.name)
  currentClient += 1;
  peakClient = peakClient > currentClient ? peakClient : currentClient;
  console.log(`[ + ] Client. Current: ${currentClient}. Peak: ${peakClient}.`);

//TODO

  ws.on('message', (message) => {

    console.log(`Received message =>_${message}_<=`);
    message = JSON.parse(message)
    // console.log(message)
    // console.log(message.tag)
    // console.log(message.data)
    switch (message.tag) {
      case 'createRoomRequest':
        createRoomRequestHandler(ws, message.data)
        break;
      case 'userJoinRoomRequest':
        userJoinRoomRequestHandler(ws, message.data)
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

const createRoomRequestHandler = (ws, data) => {
 
  ({ userName, roomId } = data);
  ws.name = userName;
  roomId=generateRoomId();
  if (true) {
    console.log('createRoomAndJoinRequestAccepted')
    wsSend(ws, 'createRoomAndJoinRequestAccepted', {userName,roomId})
    whiteboardList.push({
      id: roomId,
      whiteboardData: [],
      users: [
        { id: ws.id, name: ws.name }
      ]
    })
    console.log(`[ + ] Room created: ${roomId}`)
    ws.roomId=roomId
   // userJoinRoomRequestHandler(ws, { userId: ws.id, roomId: roomId }, true)
  } else {
    console.log('createRoomRequestRejected')
    ws.send2('createRoomRequestRejected', {})
  }


}

const userJoinRoomRequestHandler = (ws, data, bypass = false) => {
  const { userName, roomId } = data;
  ws.name = userName;
  if (whiteboardList.some(whiteboard=>whiteboard.id===roomId) || bypass) {
    //TODO: resolve request logic for accept/reject at handleUserJoinRequest
    // Default respond: always Accept

    console.log('userJoinRoomRequestAccepted')
    wsSend(ws, 'userJoinRoomRequestAccepted', { userName,roomId })
    // whiteboardList.forEach(board=>{
    //   if(board.id==roomId) board.users.push({id:ws.id,name: ws.name});
    // })
    ws.assignToRoom(roomId);
    console.log(whiteboardList)
    ws.roomId=roomId
    // New client is sent whiteboard data for sync with others
  // socket.emit('history', whiteboardData);
  wsSend(ws, "history", whiteboardList.find(whiteboard=>whiteboard.id==ws.roomId).whiteboardData)

  } else {
    console.log('RoomNotFound')
    wsSend(ws, 'RoomNotFound', {})
  }

}

const drawingHandler = (ws, data) => {
  // Save the drawing data to the history
  try{
  whiteboardList.find(whiteboard=>whiteboard.id==ws.roomId).whiteboardData.push(data)
  console.log(whiteboardList.find(whiteboard=>whiteboard.id==ws.roomId).whiteboardData.length)
  broadcast(ws, 'drawing', data)
  }catch(e){
    console.log(e)
  }
 // whiteboardList.find(whiteboard=>whiteboard.id===data.id)
  // Broadct the entire data object, including the points

  
}

const clearCanvasHandler = (ws, data) => {
  // Clear the whiteboard data
  whiteboardList.find(whiteboard=>whiteboard.id==ws.roomId).whiteboardData=[]
  broadcast(ws, 'clearCanvas', data)
}
//! WebSocket extender --------------------------------------------
const wsExtend = (ws, id, name) => {
  ws.id = id;
  ws.name = name;
  ws.assignToRoom = (roomId) => {
    // Add user id to wb memo
    whiteboardList.find(wb => wb.id === roomId).users.push({id:ws.id, name: ws.name})
  }

  ws.removeFromRoom = (roomId) => {
    // Remove user id from memo
    whiteboardList.find(wb => wb.id === roomId).users
      = whiteboardList.find(wb => wb.id === roomId).users.filter(user => user.id !== ws.id)
  }

  //! Not tested
  ws.send2 = (tag, data) => {
    ws.send(JSON.stringify({ tag: tag, data: data }))
  }

  //! Not tested
  ws.broadcast = (tag, data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === OPEN) {
        client.send(JSON.stringify({ tag: tag, data: data }));
      }
    });
  }
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
    // if (client.readyState === OPEN) {
      client.send(JSON.stringify({ tag: tag, data: data }));
    // }
  });
}

//basic send function
const wsSend = (ws, tag, data) => {
  ws.send(JSON.stringify({ tag: tag, data: data }))
}
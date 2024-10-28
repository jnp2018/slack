import React, { useEffect, useState } from 'react';
import Whiteboard from './widgets/Whiteboard';
import { Routes, Route } from 'react-router-dom';
import Form from "./widgets/Form";

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    socket.onmessage = (msg) => {
      console.log('Received from server:', msg);

      // Handle other tags or perform actions here if needed
      if (msg.tag === 'userJoinRoomRequestAccepted') {
        console.log('userJoinRoomRequestAccepted');
      } else if (msg.tag === 'userJoinRoomRequestRejected') {
        console.log('userJoinRoomRequestRejected');
      }
    };
  }, []);
  // const uuid = () => {
  //   let S4 = () => {
  //     return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  //   };
  //   return (
  //     S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4()
  //   );
  // };
  return (
    <div className='container'>
      <div className="container">
        <Routes>
          <Route path="/" element={<Form socket={socket} setUser={setUser} ></Form>}></Route>
          <Route path="/:roomId" element={<Whiteboard socket={socket}></Whiteboard>}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
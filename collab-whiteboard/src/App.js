import React, { useEffect, useState } from 'react';
import Whiteboard from './widgets/Whiteboard';
import {Routes, Route } from 'react-router-dom';
import Form from "./widgets/Form";
import io from 'socket.io-client';
const socket =
	io('https://whiteboard-server.up.railway.app/');
	// io('localhost:4000/');
function App() {
  const[user,setUser]=useState(null);
  useEffect(()=>{
    socket.on("userIsJoined",(data)=>{
     if(data.success){
       console.log("userJoined");
     }
     else console.log("userJoined error");
    });
},[]);
  const uuid=()=>{
    let S4 = () =>{
      return(((1+Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
  return(
    S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()
  );
  };
  return (
    <div className='container'>
        <div className="container">
    <Routes>
      <Route path="/" element={<Form uuid={uuid} socket={socket} setUser={setUser} ></Form>}></Route>
      <Route path="/:roomId" element={<Whiteboard socket={socket}></Whiteboard>}></Route>
    </Routes>
    </div>
    </div>
  );
}

export default App;
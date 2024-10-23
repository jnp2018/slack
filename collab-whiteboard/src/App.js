import React from 'react';
import Whiteboard from './widgets/Whiteboard';
import {Routes, Route } from 'react-router-dom';
import Form from "./widgets/Form";
function App() {
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
    //  <Route path="/" element={<Form uuid={uuid} ></Form>}></Route>

    </Routes>
    </div>
    </div>
  );
}

export default App;
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';  
const CreateRoomForm=({uuid, socket, setUser})=>{
    const [roomId, setRoomId]=useState(uuid());
    const[name,setName]=useState("");
    const navigate = useNavigate();
    const handleCreateRoom = (e)=>{
        e.preventDefault();
        const roomData = {
           name,
           roomId,
           userId: uuid(),
           host: true,
           presenter: true,
        };
        setUser(roomData);
        navigate(`/${roomId}`);
        console.log(roomData);
        socket.emit("userJoined", roomData);
    }
    function copyText() {
        const roomIdElement = document.getElementById('roomId'); // Lấy phần tử input có id "roomId"
        if (roomIdElement) {
          const textToCopy = roomIdElement.value; // Lấy giá trị của input
    
          if (textToCopy) {
            navigator.clipboard.writeText(textToCopy);
        } 
      }
    }
   return (
     <form className="form col-md-12 mt-5">
      <div className="form-group">
         <input type="text" 
         className="form-control my-2" 
         placeholder="Enter you name"
         value={name}
         onChange={(e)=>setName(e.target.value)}
         />
      </div>
      <div className="form-group border">
             
         <div className="input-group d-flex gap-1 align-items-center justify-content-center">
            <input  id="roomId" 
             type="text"
              value={roomId}
            className="form-control my-2 border-0"
            disabled 
            placeholder="Generate room code"
            />
            <div className="input-group-append">
               <button className="btn btn-primary btn-sm me-1"
                           onClick={()=>setRoomId(uuid)} 
                type="button">
                  generate        
               </button>
               <button className="btn btn-outline-danger btn-sm me-2" 
               onClick={copyText}
              type="button">
                  copy
               </button>
             
            </div>
         </div>
      </div>
     <button type="submit" 
     className="mt-4 btn btn-primary btn-block form-control"
     onClick={handleCreateRoom}>
         Generate Room
     </button>
     </form>
   );
};
export default CreateRoomForm;
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';  
const CreateRoomForm=({uuid})=>{
    const [roomId, setRoomId]=useState(uuid());
   return (
     <form className="form col-md-12 mt-5">
      <div className="form-group">
         <input type="text" 
         className="form-control my-2" 
         placeholder="Enter you name"
         />
      </div>
      <div className="form-group border">
             
         <div className="input-group d-flex gap-1 align-items-center justify-content-center">
            <input type="text"
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
               type="button">
                  copy
               </button>
             
            </div>
         </div>
      </div>
     <button type="submit" 
     className="mt-4 btn btn-primary btn-block form-control"
    >
         Generate Room
     </button>
     </form>
   );
};
export default CreateRoomForm;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const JoinRoomForm=()=>{
    
    return (
      <form className="form col-md-12 mt-5">
       <div className="form-group">
          <input type="text" 
          className="form-control my-2" 
          placeholder="Enter you name"
        
          />
       </div>
       <div className="form-group">
             <input type="text"
             className="form-control my-2 "
             placeholder="Enter room code"
            
             /> 
       </div>
      <button type="submit" 
      className="mt-4 btn btn-primary btn-block form-control"
     >
          Join Room
      </button>
      </form>
    );
 };
 export default JoinRoomForm;
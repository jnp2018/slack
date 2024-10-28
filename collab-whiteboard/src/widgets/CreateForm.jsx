import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
const CreateRoomForm = ({ uuid, socket, setUser }) => {
   const [roomId, setRoomId] = useState("");
   const [userName, setUserName] = useState("");
   const navigate = useNavigate();
   const handleCreateRoom = (e) => {
      e.preventDefault();
      const requestData = {
         userName
         // roomId
      };
      setUser(requestData);
      let roomCreateAcceptance = 'pending';
      let roomJoinAcceptance = 'pending';
      let roomCode = '';

      console.log(requestData);
      /*
      * flow:
         - send a create room request
         - server try to resolve it
         - after the request is accepted, it send acceptance
         - server try to put user in that room
         - if succeed, it send acceptance
      */
      socket.send(JSON.stringify({ tag: 'createRoomRequest', data: requestData }))
      socket.onmessage('message', (message) => {
         console.log(message)
         if (message.tag == 'createRoomRequestAccepted') roomCreateAcceptance = 'accepted';
         if (message.tag == 'createRoomRequestRejected') roomCreateAcceptance = 'rejected';

         if (message.tag == 'userJoinRoomRequestAccepted') { //Should always be accepted
            roomJoinAcceptance = 'accepted';
         }
         if (message.tag == 'userJoinRoomRequestRejected') {
            roomJoinAcceptance = 'rejected';
         }

         console.log({
            roomCreateAcceptance: roomCreateAcceptance,
            roomJoinAcceptance: roomJoinAcceptance,
            roomCode: roomCode
         })

         roomCode = message.data.roomId;
         if (roomCreateAcceptance === 'rejected') {
            alert(`Cannot create room`)
         } else if (roomJoinAcceptance === 'rejected') {
            alert(`Join Request Not Accepted`)
         } else if (roomCreateAcceptance === 'accepted' && roomJoinAcceptance === 'accepted') {
            navigate(`/${roomCode}`);
         }
      })


   }
   // function copyText() {
   //    const roomIdElement = document.getElementById('roomId'); // Lấy phần tử input có id "roomId"
   //    if (roomIdElement) {
   //       const textToCopy = roomIdElement.value; // Lấy giá trị của input

   //       if (textToCopy) {
   //          navigator.clipboard.writeText(textToCopy);
   //       }
   //    }
   // }
   return (
      <form className="form col-md-12 mt-5">
         <div className="form-group">
            <input type="text"
               className="form-control my-2"
               placeholder="Enter you name"
               value={userName}
               onChange={(e) => setUserName(e.target.value)}
            />
         </div>
         <div className="form-group border">

            {/* <div className="input-group d-flex gap-1 align-items-center justify-content-center">
               <input id="roomId"
                  type="text"
                  value={roomId}
                  className="form-control my-2 border-0"
                  disabled
                  placeholder="Generate room code"
               />
               <div className="input-group-append">
                  <button className="btn btn-primary btn-sm me-1"
                     onClick={() => setRoomId(uuid)}
                     type="button">
                     generate
                  </button>
                  <button className="btn btn-outline-danger btn-sm me-2"
                     onClick={copyText}
                     type="button">
                     copy
                  </button>
               </div>
            </div> */}
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
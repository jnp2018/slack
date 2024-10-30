import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WebSocketContext } from '../WebSocketContext'; // Import the WebSocket context

const JoinRoomForm = ({ setUser }) => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  // const socket = useContext(WebSocketContext); // Access the WebSocket instance from context
  const { message, sendMessage } = useContext(WebSocketContext)

  let roomJoinAcceptance = 'pending';
  let roomFound = 'pending';

  const handleRoomJoin = (e) => {
    e.preventDefault();
    const requestData = {
      userName,
      roomId
    };
    setUser(requestData);
    sendMessage('userJoinRoomRequest', requestData)
    // socket.send("userJoinRoomRequest", requestData);
    // socket.send(JSON.stringify({ tag: 'userJoinRoomRequest', data: requestData }))
  }
  useEffect(() => {
    console.log("Executing useEffect...");

    if (!message) {
        console.log('No message received');
        return;
    }

    console.log(`Received message: ${message}`);
    
    let parsedMessage;
    try {
        parsedMessage = JSON.parse(message);
        console.log('Parsed message:', parsedMessage);
    } catch (error) {
        console.error('Failed to parse message:', error);
        return;
    }

    let roomJoinAcceptance;
    switch (parsedMessage.tag) {
        case 'roomNotFound':
            roomJoinAcceptance = 'rejected';
            break;
        case 'userJoinRoomRequestAccepted':
            roomJoinAcceptance = 'accepted';
            break;
        default:
            console.warn('Unhandled message tag:', parsedMessage.tag);
            return;
    }

    console.log({ roomJoinAcceptance });

    if (roomJoinAcceptance === 'rejected') {
        alert('Join Request Not Accepted');
    } else if (roomJoinAcceptance === 'accepted') {
        navigate(`/${roomId}`);
    }
}, [message]);


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
      <div className="form-group">
        <input type="text"
          className="form-control my-2 "
          placeholder="Enter room code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>
      <button type="submit"
        className="mt-4 btn btn-primary btn-block form-control"
        onClick={handleRoomJoin}>
        Join Room
      </button>
    </form>
  );
};
export default JoinRoomForm;
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
    if (!message) {
      console.log('no message')
      return
    }
    console.log(`Received message =>_${message}_<=`);
    if (message.tag == 'roomFound') roomFound = 'found';
    if (message.tag == 'roomNotFound') roomFound = 'notFound';

    if (message.tag == 'userJoinRoomRequestAccepted') roomJoinAcceptance = 'accepted';
    if (message.tag == 'userJoinRoomRequestRejected') roomJoinAcceptance = 'rejected';

    console.log({
      roomJoinAcceptance: roomJoinAcceptance,
      roomFound: roomFound
    })

    if (roomFound === 'notFound') {
      alert(`Room ${roomId} not found`)
    } else if (roomJoinAcceptance === 'rejected') {
      alert(`Join Request Not Accepted`)
    } else if (roomFound === 'found' && roomJoinAcceptance === 'accepted') {
      navigate(`/${roomId}`);
    }
  }, [message]) // Effect update on message change

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
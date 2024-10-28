import { useState } from "react";
import { useNavigate } from "react-router-dom";
const JoinRoomForm = ({ uuid, socket, setUser }) => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const handleRoomJoin = (e) => {
    e.preventDefault();
    const requestData = {
      userName,
      roomId
    };
    setUser(requestData);

    let roomJoinAcceptance = 'pending';
    let roomFound = 'pending';
    // socket.send("userJoinRoomRequest", requestData);
    socket.send(JSON.stringify({ tag: 'userJoinRoomRequest', data: requestData }))
    socket.onmessage('message', (message) => {

      if (message.tag == 'roomFound') roomFound = 'found';
      if (message.tag == 'roomNotFound') roomFound = 'notFound';

      if (message.tag == 'userJoinRoomRequestAccepted') roomJoinAcceptance = 'accepted';
      if (message.tag == 'userJoinRoomRequestRejected') roomJoinAcceptance = 'rejected';


    })
    if (roomFound === 'notFound') {
      alert(`Room ${roomId} not found`)
    } else if (roomJoinAcceptance === 'rejected') {
      alert(`Join Request Not Accepted`)
    } else if (roomFound === 'found' && roomJoinAcceptance === 'accepted') {
      navigate(`/${roomId}`);
    }

  }

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
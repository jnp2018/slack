/**
 * This file is for context use of Websocket
 * It create a wrapper that can be accessed my any element inside
 * Should be wrapped at the most outer layer in index.js
 */

import React, { createContext, useEffect, useState } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {

    // const socket =
    //   io('https://whiteboard-server.up.railway.app/');
    // // io('localhost:4000/');
    const socket = new WebSocket('ws://localhost:4000'); // Use ws:// protocol
    setSocket(socket);

    socket.onmessage = (event) => {
      //TODO: need test
      const parsedMessage = JSON.parse(event.data);
      setMessage(parsedMessage); // Update message state on each new message
    };

    socket.onopen = () => console.log('Connected to WebSocket server');
    socket.onclose = () => console.log('Disconnected from WebSocket server');

    return () => socket.close(); // Clean up when component unmounts
  }, []);

  const sendMessage = (tag, data) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ tag, data }));
    }
  };

  return (
    <WebSocketContext.Provider value={{ message, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

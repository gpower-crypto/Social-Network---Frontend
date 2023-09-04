import React, { useState } from "react";
import WebSocket from "react-websocket";

const WebSocketComponent = () => {
  const [receivedData, setReceivedData] = useState("");

  const handleData = (data) => {
    // Handle data received from the WebSocket server
    setReceivedData(data);
  };

  return (
    <div>
      <WebSocket
        url="ws://localhost:8000/ws/chat/" // Replace with your WebSocket URL
        onMessage={handleData}
      />
      <div>Received Data: {receivedData}</div>
    </div>
  );
};

export default WebSocketComponent;

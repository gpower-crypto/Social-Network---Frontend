// WebSocketService.js
import { io } from "socket.io-client";

const socket = io("ws://localhost:8000/ws/chat/");

const connect = () => {
  socket.connect();
};

const disconnect = () => {
  socket.disconnect();
};

const sendMessage = (message) => {
  socket.emit("send_message", message);
};

const subscribeToChat = (callback) => {
  socket.on("receive_message", (message) => {
    callback(message);
  });
};

export { connect, disconnect, sendMessage, subscribeToChat };

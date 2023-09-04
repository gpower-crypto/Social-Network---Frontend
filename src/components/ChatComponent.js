import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Chat() {
  const { friendId } = useParams();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [chatSocket, setChatSocket] = useState(null);
  const { userId } = useParams();

  const fetchChatMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/chat-messages/user_chat/?friend_id=${friendId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const messages = data.map((message) => message.content);
        setChat(messages);
      } else {
        console.error("Error fetching chat messages");
      }
    } catch (error) {
      console.error("Error fetching chat messages", error);
    }
  };

  const setupWebSocket = () => {
    // Connect to the WebSocket server with the friend's ID
    const socket = new WebSocket(`ws://localhost:8000/ws/chat/${friendId}/`);
    setChatSocket(socket);

    // Handle incoming messages from WebSocket
    socket.onmessage = (e) => {
      const newMessage = JSON.parse(e.data).message;
      setChat((prevChat) => [...prevChat, newMessage]);
    };

    return socket;
  };

  useEffect(() => {
    // Fetch chat messages when the component loads
    fetchChatMessages();

    // Set up WebSocket connection when the component mounts
    const socket = setupWebSocket();

    return () => {
      // Clean up WebSocket connection when the component unmounts
      socket.close();
    };
  }, [friendId, userId]);

  const sendMessage = async () => {
    if (chatSocket.readyState === WebSocket.OPEN && message.trim() !== "") {
      // Send the message via WebSocket
      chatSocket.send(JSON.stringify({ message }));

      // Create a new chat message in the database
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/chat-messages/create_message/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiver_id: friendId, // Set the friend's ID as the receiver
            content: message, // Set the message content
          }),
        }
      );

      if (response.ok) {
        console.log("Chat message sent successfully");
      } else {
        // Handle error
        console.error("Error sending chat message");
      }

      setMessage("");
    }
  };

  return (
    <div className="App">
      <h1>Chat with Friend</h1>
      <div id="chat">
        {chat.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../styles/Chat.css";
import NavigationBar from "./NavigationBar";

function Chat() {
  const { friendId } = useParams();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [chatSocket, setChatSocket] = useState(null);
  const [userUsername, setUserUsername] = useState("");
  const [friendUsername, setFriendUsername] = useState("");
  const chatContainerRef = useRef(null);

  const token = localStorage.getItem("token");
  const [header, payload, signature] = token.split(".");
  const decodedPayload = atob(payload);
  const user = JSON.parse(decodedPayload);
  const userId = user.user_id;

  useEffect(() => {
    // Scroll to the bottom of the chat container
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chat]); // Scroll whenever the chat state updates

  const fetchChatMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/chat-messages/user_chat/?friend_id=${friendId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Map chat messages and add a 'sender' property
        const chatWithSenders = data.map((message) => ({
          ...message,
          sender: message.sender === userId ? "current-user" : "friend-user",
        }));

        setChat(chatWithSenders);
      } else {
        console.error("Error fetching chat messages");
      }
    } catch (error) {
      console.error("Error fetching chat messages", error);
    }
  };

  const setupWebSocket = () => {
    const socket = new WebSocket(`ws://localhost:8000/ws/chat/${friendId}/`);
    setChatSocket(socket);

    socket.onmessage = (e) => {
      const messageText = JSON.parse(e.data).message;

      const newMessage = {
        content: messageText,
        sender: friendId === userId ? "friend-user" : "current-user",
      };

      setChat((prevChat) => [...prevChat, newMessage]);
    };

    return socket;
  };

  const fetchUsernames = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch the username of the user
      const userResponse = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserUsername(userData.username);
      }

      // Fetch the username of the friend
      const friendResponse = await fetch(
        `http://127.0.0.1:8000/api/users/${friendId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (friendResponse.ok) {
        const friendData = await friendResponse.json();
        setFriendUsername(friendData.username);
      }
    } catch (error) {
      console.error("Error fetching usernames", error);
    }
  };

  fetchUsernames();

  useEffect(() => {
    // Fetch usernames when the component loads
    fetchUsernames();
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
        "http://127.0.0.1:8000/api/chat-messages/create_message/",
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
    <>
      {/* Top Navigation Bar */}
      <div className="chat-page-container">
        <NavigationBar activePage="friends" />
        <div className="chat-container">
          <div className="chat-header">Chat with Friend</div>
          <div id="chat" className="chat-messages" ref={chatContainerRef}>
            {chat.map((message, index) => (
              <div key={index} className={`chat-message ${message.sender}`}>
                <p>{message.content}</p>
                <span className="user">
                  {message.sender === "current-user"
                    ? userUsername
                    : friendUsername}
                </span>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;

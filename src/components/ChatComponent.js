// I wrote this code

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../styles/Chat.css";
import NavigationBar from "./NavigationBar";

function Chat() {
  const { friendId } = useParams();
  const [message, setMessage] = useState(""); // State for the message input
  const [chat, setChat] = useState([]); // State for storing chat messages
  const [newChat, setNewChat] = useState([]);
  const [chatSocket, setChatSocket] = useState(null); // State for WebSocket
  const [userUsername, setUserUsername] = useState(""); // User's username
  const [friendUsername, setFriendUsername] = useState(""); // Friend's username
  const chatContainerRef = useRef(null); // Reference to chat container

  // Extract user information from the JWT token
  const token = localStorage.getItem("token");
  const [header, payload, signature] = token.split(".");
  const decodedPayload = atob(payload);
  const user = JSON.parse(decodedPayload);
  const userId = user.user_id;

  // Create a unique chat session identifier
  const chatSessionIdentifier = [userId, friendId].sort().join("_");

  // Function to scroll to the bottom of the chat container
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chat, newChat]); // Scroll when the chat state updates

  // Function to fetch chat messages
  const fetchChatMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/chat-messages/user_chat/?friend_id=${friendId}`,
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

  // Function to set up WebSocket connection
  const setupWebSocket = () => {
    const socket = new WebSocket(
      `ws://socialnetwork-LB-222140309.us-east-1.elb.amazonaws.com:8000/ws/chat/${chatSessionIdentifier}/`
    );
    setChatSocket(socket);

    // Handle incoming WebSocket messages
    socket.onmessage = (e) => {
      const messageData = JSON.parse(e.data);

      // Updated message structure to include sender's name
      const newMessage = {
        sender: messageData.sender_name,
        sender_id: messageData.sender_id === userId ? "current-user" : "friend-user",
        content: messageData.message,
      };

      setNewChat((prevChat) => [...prevChat, newMessage]);
    };

    return socket;
  };

  // Function to fetch usernames
  const fetchUsernames = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch the username of the user
      const userResponse = await fetch(
        `${process.env.REACT_APP_API}/api/users/${userId}/`,
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
        `${process.env.REACT_APP_API}/api/users/${friendId}/`,
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

  useEffect(() => {
    // Fetch usernames, chat messages, and set up WebSocket when the component loads
    fetchUsernames();
    fetchChatMessages();
    const socket = setupWebSocket();

    return () => {
      // Clean up WebSocket connection when the component unmounts
      socket.close();
    };
  }, [friendId, userId]);

  // Function to send a chat message
  const sendMessage = async () => {
    if (chatSocket.readyState === WebSocket.OPEN && message.trim() !== "") {
      // Send the message via WebSocket
      // look it sends this to the consumer which then gets the name of the user using the user profile model and gives it to the websocket
      chatSocket.send(JSON.stringify({ sender_id: userId, message: message.trim() }))
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
            {newChat.map((message, index) => (
              <div key={index} className={`chat-message ${message.sender_id}`}>
                {console.log(message.sender_id)}

                <p>{message.content}</p>
                <span className="user">{message.sender}</span>
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

// end of code I wrote

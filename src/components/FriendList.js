import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/FriendList.css"; // Import the CSS file
import NavigationBar from "./NavigationBar";

function FriendList() {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://127.0.0.1:8000/api/users/friends/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setFriends(data);
        } else {
          console.error("Error fetching friends list");
        }
      } catch (error) {
        console.error("Error fetching friends list", error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="friend-list">
      {/* Top Navigation Bar */}
      <NavigationBar activePage="friends" />
      <h2>Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id} className="friend-item">
            <div className="friend-details">
              <strong>{friend.username}</strong>{" "}
              <Link to={`/chat/${friend.id}`} className="chat-button">
                Chat
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendList;

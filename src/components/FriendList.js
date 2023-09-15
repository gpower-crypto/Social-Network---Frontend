import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/FriendList.css";
import NavigationBar from "./NavigationBar";

function FriendList() {
  const [friends, setFriends] = useState([]); // State to store friends list

  useEffect(() => {
    // Function to fetch the user's friends list
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

    fetchFriends(); // Fetch friends list when the component mounts
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
              {/* Link to open chat page with the friend */}
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

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
      <h2>Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>
            {friend.username}
            <Link to={`/chat/${friend.id}`}>Chat</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendList;

// UserList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import "../styles/UserList.css";
import UserProfile from "./UserProfile";

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [header, payload, signature] = token.split(".");
  const decodedPayload = atob(payload);
  const user = JSON.parse(decodedPayload);
  const userId = user.user_id;

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/users/");
      const data = await response.json();
      const filteredUsers = data.filter((user) => user.id !== userId);
      setUserList(filteredUsers);
    };

    fetchUsers();
  }, []);

  const sendFriendRequest = async (userId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://127.0.0.1:8000/api/friend-requests/send_request/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to_user: userId,
        }),
      }
    );

    if (response.ok) {
      setMessage("Friend request sent successfully");
    } else {
      const errorData = await response.json();
      setMessage(`Error: ${errorData.detail}`);
    }
  };

  const handleViewProfile = (userId) => {
    setSelectedUserId(userId);
    setShowProfile(true); // Show the profile component when "View Profile" is clicked
  };

  const handleBackToUserList = () => {
    setShowProfile(false);
    setSelectedUserId(null);
  };

  return (
    <div className="user-list">
      {/* Top Navigation Bar */}
      <NavigationBar activePage="users" />
      <h2>Users</h2>
      {message && (
        <div className={message.includes("Error") ? "error" : "success"}>
          {message}
        </div>
      )}
      {showProfile ? (
        // Render the Profile component if showProfile is true
        <UserProfile
          userId={selectedUserId}
          showEditButton={false}
          onClose={() => setShowProfile(false)}
        />
      ) : (
        <>
          <ul>
            {userList.map((user) => (
              <li key={user.id}>
                <strong>{user.username}</strong>{" "}
                <button onClick={() => sendFriendRequest(user.id)}>
                  Send Friend Request
                </button>
                {/* Add the view-profile-button class to style the button */}
                <button
                  className="view-profile-button"
                  onClick={() => handleViewProfile(user.id)}
                >
                  View Profile
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {/* Add a "Back" button */}
      {showProfile && (
        <button className="back-button" onClick={handleBackToUserList}>
          &larr; Back to Users
        </button>
      )}
    </div>
  );
};

export default UserList;

import React, { useEffect, useState } from "react";
import NavigationBar from "./NavigationBar";
import "../styles/UserList.css";
import UserProfile from "./UserProfile";

const UserList = () => {
  // State variables for user list, token, message, and profile display
  const [userList, setUserList] = useState([]);
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Extract user information from the JWT token
  const [header, payload, signature] = token.split(".");
  const decodedPayload = atob(payload);
  const user = JSON.parse(decodedPayload);
  const userId = user.user_id;

  // useEffect to fetch the list of users when the component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/users/");
      const data = await response.json();

      // Filter out the current user from the list
      const filteredUsers = data.filter((user) => user.id !== userId);
      setUserList(filteredUsers);
    };

    fetchUsers();
  }, []);

  // Function to send a friend request to a user
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

  // Function to handle viewing a user's profile
  const handleViewProfile = (userId) => {
    setSelectedUserId(userId);
    setShowProfile(true); // Show the profile component when "View Profile" is clicked
  };

  // Function to handle going back to the user list from a profile view
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
                {/* view-profile-button class to style the button */}
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
      {/* "Back" button */}
      {showProfile && (
        <button className="back-button" onClick={handleBackToUserList}>
          &larr; Back to Users
        </button>
      )}
    </div>
  );
};

export default UserList;

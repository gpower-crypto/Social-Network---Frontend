// UserList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");

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

  return (
    <div className="user-list">
      <h2>Users</h2>
      {message && (
        <div className={message.includes("Error") ? "error" : "success"}>
          {message}
        </div>
      )}
      <ul>
        {userList.map((user) => (
          <li key={user.id}>
            <strong>{user.username}</strong>{" "}
            <button onClick={() => sendFriendRequest(user.id)}>
              Send Friend Request
            </button>
            <Link to={`/profile/${user.id}`}>View Profile</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;

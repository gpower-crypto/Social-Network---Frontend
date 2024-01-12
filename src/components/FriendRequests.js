// I wrote this code

import React, { useEffect, useState } from "react";
import "../styles/FriendRequests.css";
import NavigationBar from "./NavigationBar";

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]); // State to store friend requests
  const [usernames, setUsernames] = useState({}); // State to store usernames

  // Extract user information from the JWT token
  const token = localStorage.getItem("token");
  const [header, payload, signature] = token.split(".");
  const decodedPayload = atob(payload);
  const user = JSON.parse(decodedPayload);
  const userId = user.user_id;

  // Function to fetch friend requests and associated usernames
  const fetchFriendRequests = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/friend-requests/friend_requests/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setFriendRequests(data);

      // Extract unique user IDs from friend requests
      const allUserIds = Array.from(
        new Set([
          ...data.map((request) => request.from_user),
          ...data.map((request) => request.to_user),
        ])
      );

      // Fetch usernames for all user IDs
      const usernamesData = await Promise.all(
        allUserIds.map(async (userId) => {
          const userResponse = await fetch(
            `${process.env.REACT_APP_API}/api/users/${userId}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const userData = await userResponse.json();
          return { id: userId, username: userData.username };
        })
      );

      // Create an object to map user IDs to usernames
      const usernamesObj = {};
      usernamesData.forEach((userData) => {
        usernamesObj[userData.id] = userData.username;
      });

      setUsernames(usernamesObj); // Update the usernames state
    } else {
      console.error("Error fetching friend requests");
    }
  };

  useEffect(() => {
    fetchFriendRequests(); // Fetch friend requests and usernames when the component mounts
  }, []);

  // Function to handle accepting a friend request
  const handleAcceptRequest = async (requestId, fromUserId) => {
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/friend-requests/${requestId}/accept_request/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      fetchFriendRequests(); // Refetch friend requests after accepting
    } else {
      console.error("Error accepting friend request");
    }
  };

  // Function to handle rejecting a friend request
  const handleRejectRequest = async (requestId, fromUserId) => {
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/friend-requests/${requestId}/reject_request/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      fetchFriendRequests(); // Refetch friend requests after rejecting
    } else {
      console.error("Error rejecting friend request");
    }
  };

  return (
    <div className="friend-requests-page">
      {/* Top Navigation Bar */}
      <NavigationBar activePage="friend-requests" />
      <div className="friend-requests">
        <h2>Friend Requests</h2>
        <ul>
          {friendRequests.map((request) => (
            <li key={request.id} className="friend-request-item">
              {request.from_user === userId ? (
                <>
                  <span className="request-info">
                    To: {usernames[request.to_user]}
                  </span>
                  <span className="request-status">
                    Status: {request.status}
                  </span>
                </>
              ) : (
                <>
                  <span className="request-info">
                    From: {usernames[request.from_user]}
                  </span>
                  <span className="request-status">
                    Status: {request.status}
                  </span>
                  {request.status === "pending" && (
                    <div className="action-buttons">
                      <button
                        className="accept-button"
                        onClick={() =>
                          handleAcceptRequest(request.id, request.from_user)
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="reject-button"
                        onClick={() =>
                          handleRejectRequest(request.id, request.from_user)
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FriendRequests;

// end of code I wrote

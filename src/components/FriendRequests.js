import React, { useEffect, useState } from "react";

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);
  const [usernames, setUsernames] = useState({});

  const token = localStorage.getItem("token");
  const [header, payload, signature] = token.split(".");
  const decodedPayload = atob(payload);
  const user = JSON.parse(decodedPayload);
  const userId = user.user_id;

  const fetchFriendRequests = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/api/friend-requests/friend_requests/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setFriendRequests(data);

      const allUserIds = Array.from(
        new Set([
          ...data.map((request) => request.from_user),
          ...data.map((request) => request.to_user),
        ])
      );

      const usernamesData = await Promise.all(
        allUserIds.map(async (userId) => {
          const userResponse = await fetch(
            `http://127.0.0.1:8000/api/users/${userId}/`,
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

      const usernamesObj = {};
      usernamesData.forEach((userData) => {
        usernamesObj[userData.id] = userData.username;
      });

      setUsernames(usernamesObj);
    } else {
      console.error("Error fetching friend requests");
    }
  };

  useEffect(() => {
    fetchFriendRequests();
  }, []);

  const handleAcceptRequest = async (requestId, fromUserId) => {
    const response = await fetch(
      `http://127.0.0.1:8000/api/friend-requests/${requestId}/accept_request/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      fetchFriendRequests();
    } else {
      console.error("Error accepting friend request");
    }
  };

  const handleRejectRequest = async (requestId, fromUserId) => {
    const response = await fetch(
      `http://127.0.0.1:8000/api/friend-requests/${requestId}/reject_request/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      fetchFriendRequests();
    } else {
      console.error("Error rejecting friend request");
    }
  };

  return (
    <div className="friend-requests">
      <h2>Friend Requests</h2>
      <ul>
        {friendRequests.map((request) => (
          <li key={request.id}>
            {request.from_user === userId ? (
              <>
                To: {usernames[request.to_user]}, Status: {request.status}
              </>
            ) : (
              <>
                From: {usernames[request.from_user]}, Status: {request.status}
                {request.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleAcceptRequest(request.id, request.from_user)
                      }
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleRejectRequest(request.id, request.from_user)
                      }
                    >
                      Reject
                    </button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequests;

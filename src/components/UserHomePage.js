import React, { useState, useEffect } from "react";
import "../styles/UserHomePage.css";
import Comments from "./Comments";
import UserProfile from "./UserProfile";
import NavigationBar from "./NavigationBar";

function UserHomePage() {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [userStatus, setUserStatus] = useState("");

  const token = localStorage.getItem("token");
  const [header, payload, signature] = token.split(".");
  const decodedPayload = atob(payload);
  const user = JSON.parse(decodedPayload);
  const userId = user.user_id;

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/posts/");
      const postData = await response.json();
      const postsWithUserNames = await Promise.all(
        postData.map(async (post) => {
          const userResponse = await fetch(
            `http://127.0.0.1:8000/api/users/${post.user}/`
          );
          const userData = await userResponse.json();
          return {
            ...post,
            user: userData.username,
          };
        })
      );
      const reversedPosts = postsWithUserNames.reverse();
      setPosts(reversedPosts);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/status/`, // Updated URL
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const { status } = await response.json();
          setUserStatus(status);
        } else {
          console.error("Error fetching user status");
        }
      } catch (error) {
        console.error("Error fetching user status", error);
      }
    };

    fetchUserStatus();
  }, [token]);

  const updateUserStatus = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/update_status/`, // Updated URL
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: userStatus }),
        }
      );

      if (response.ok) {
        console.log("User status updated successfully");
      } else {
        console.error("Error updating user status");
      }
    } catch (error) {
      console.error("Error updating user status", error);
    }
  };

  const handlePostSubmit = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/posts/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newPostContent,
        user: userId,
      }),
    });

    if (response.ok) {
      setNewPostContent("");
      const newPostData = await response.json();
      const userResponse = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/`
      );
      const userData = await userResponse.json();
      const newPostWithUsername = {
        ...newPostData,
        user: userData.username,
      };
      setPosts((prevPosts) => [newPostWithUsername, ...prevPosts]);
    } else {
      console.error("Error submitting post");
    }
  };

  return (
    <div className="dashboard">
      {/* Top Navigation Bar */}
      <NavigationBar activePage="home" />

      {/* Content Container for User Profile and Dashboard Content */}
      <div className="content-container">
        {/* User Profile */}
        <div className="user-profile">
          {/* Render the User Profile component here */}
          <UserProfile userId={userId} showEditButton={true} />
        </div>

        {/* Main Content Area (Dashboard Content) */}
        <div className="dashboard-content">
          <h1>Welcome</h1>

          {/* User Status Input */}
          <div className="user-status">
            <h4>Status</h4>
            <input
              type="text"
              value={userStatus}
              onChange={(e) => setUserStatus(e.target.value)}
              placeholder="Update your status..."
            />
            <button onClick={updateUserStatus}>Update</button>
          </div>

          {/* Post Form */}
          <div className="post-form">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Write your post..."
            />
            <button onClick={handlePostSubmit}>Post</button>
          </div>

          {/* Post List */}
          <div className="post-list">
            <h2>Posts</h2>
            <ul>
              {posts.map((post) => (
                <li key={post.id}>
                  <div className="post">
                    <span className="post-user">{post.user}</span>
                    <span className="post-text">{post.text}</span>
                  </div>
                  <Comments userId={userId} postId={post.id} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHomePage;

// NavigationBar.js

import React from "react";
import { Link } from "react-router-dom";
import "../styles/NavigationBar.css";

const NavigationBar = ({ activePage }) => {
  const handleSignOut = () => {
    localStorage.removeItem("token"); // Clear the authentication token
    localStorage.removeItem("newUser"); // Clear the newUser flag
    window.location.href = "/";
  };

  return (
    <div className="top-nav">
      <div className="nav-links">
        <Link
          to="/home"
          className={`nav-link ${activePage === "home" ? "active" : ""}`}
        >
          Home
        </Link>
        <Link
          to="/users"
          className={`nav-link ${activePage === "users" ? "active" : ""}`}
        >
          Users
        </Link>
        <Link
          to="/friends"
          className={`nav-link ${activePage === "friends" ? "active" : ""}`}
        >
          Friends
        </Link>
        <Link
          to="/friend-requests"
          className={`nav-link ${
            activePage === "friend-requests" ? "active" : ""
          }`}
        >
          Friend Requests
        </Link>
      </div>
      <div className="sign-out-button-container">
        <button className="sign-out-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;

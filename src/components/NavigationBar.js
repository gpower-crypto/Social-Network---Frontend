// I wrote this code

import React from "react";
import { Link } from "react-router-dom";
import "../styles/NavigationBar.css";

// NavigationBar component receives an 'activePage' prop to highlight the active link
const NavigationBar = ({ activePage }) => {
  // Function to handle user sign-out
  const handleSignOut = () => {
    localStorage.removeItem("token"); // Clear the authentication token
    localStorage.removeItem("newUser"); // Clear the newUser flag
    window.location.href = "/"; // Redirect the user to the home page
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

// end of code I wrote  
// I wrote this code

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage() {
  // State variables to manage username, password, error, and success message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Function to handle the login process
  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Send a POST request to the server to obtain an access token
    const response = await fetch(`${process.env.REACT_APP_API}/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const accessToken = data.access;
      localStorage.setItem("token", accessToken);

      // Check if the user is a new user
      const isNewUser = localStorage.getItem("newUser") === "true";
      console.log("isNewUser:", isNewUser);

      // Redirect the user based on whether they are new or existing
      if (isNewUser) {
        navigate("/profile-setup"); // Redirect to profile setup for new users
      } else {
        navigate("/home"); // Redirect to the home page for existing users
      }
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-page">
      <h1>Welcome to My Social Network</h1>
      <form>
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
        <button type="button" className="login-button" onClick={handleLogin}>
          Login
        </button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}

export default LoginPage;

// end of code I wrote

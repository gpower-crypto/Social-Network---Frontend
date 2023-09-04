import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API}/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "unsafe_url",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const accessToken = data.access;
      console.log(accessToken);
      localStorage.setItem("token", accessToken);

      // Check if the user is a new user
      const isNewUser = localStorage.getItem("newUser") === "true";
      console.log("isNewUser:", isNewUser);

      if (isNewUser) {
        navigate("/profile-setup");
      } else {
        navigate("/dashboard");
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

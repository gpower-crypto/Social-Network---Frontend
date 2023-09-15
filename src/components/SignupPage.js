import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/SignupPage.css";

function SignupPage() {
  // State variables to manage form input values
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // State to track form field errors
  const navigate = useNavigate();

  // Function to validate the form fields
  const validateForm = () => {
    const errors = {};

    if (!username) {
      errors.username = "Username is required";
    }

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // Function to handle user registration
  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    const response = await fetch(`http://127.0.0.1:8000/api/users/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    if (response.ok) {
      // Set the newUser flag to true to indicate a new user
      localStorage.setItem("newUser", "true");
      console.log("Registration successful");
      navigate("/");
    } else {
      // Handle registration errors
      console.log("Registration failed");
      alert(response.errors); // Display an alert with registration errors
    }
  };

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <form>
        <div className="form-group">
          <label>Username</label>
          <input type="text" onChange={(e) => setUsername(e.target.value)} />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>
        <button className="signup-button" type="button" onClick={handleSignup}>
          Sign Up
        </button>
      </form>
      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default SignupPage;

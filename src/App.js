import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ProfileSetupPage from "./components/ProfileSetupPage";
import UserHomePage from "./components/UserHomePage";
import UserList from "./components/UserList";
import FriendList from "./components/FriendList";
import FriendRequests from "./components/FriendRequests";
import ProfileEditPage from "./components/ProfileEditPage";
import Chat from "./components/ChatComponent";

// Function to check if the user is authenticated
function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (!token) {
    return false; // No token means user is not authenticated
  }

  // Decode the token to get user data
  const tokenData = JSON.parse(atob(token.split(".")[1]));

  // Check if the token has expired
  const expirationTime = tokenData.exp * 1000;
  const isNewUser = localStorage.getItem("newUser") === "true";

  // Return true if the token is valid and not expired, and it's not a new user
  return Date.now() < expirationTime && !isNewUser;
}

// A protected route component
function PrivateRoute({ path, element }) {
  return isAuthenticated() ? element : <Navigate to="/" />; // Render the provided element if authenticated, otherwise navigate to the login page
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile-setup" element={<ProfileSetupPage />} />
        {/* Use PrivateRoute to protect these routes */}
        <Route
          path="/home"
          element={<PrivateRoute element={<UserHomePage />} />}
        />
        <Route
          path="/profile/:userId/edit"
          element={<PrivateRoute element={<ProfileEditPage />} />}
        />
        <Route
          path="/users"
          element={<PrivateRoute element={<UserList />} />}
        />
        <Route
          path="/friends"
          element={<PrivateRoute element={<FriendList />} />}
        />
        <Route
          path="/friend-requests"
          element={<PrivateRoute element={<FriendRequests />} />}
        />
        <Route
          path="/chat/:friendId"
          element={<PrivateRoute element={<Chat />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

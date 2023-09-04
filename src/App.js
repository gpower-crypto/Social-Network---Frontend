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
import UserDashboard from "./components/UserDashboard";
import UserProfile from "./components/UserProfile";
import UserList from "./components/UserList";
import FriendList from "./components/FriendList";
import FriendRequests from "./components/FriendRequests";
import ProfileEditPage from "./components/ProfileEditPage";
import Chat from "./components/ChatComponent";

function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }

  const tokenData = JSON.parse(atob(token.split(".")[1]));
  const expirationTime = tokenData.exp * 1000;

  const isNewUser = localStorage.getItem("newUser") === "true";

  return Date.now() < expirationTime && !isNewUser;
}

function PrivateRoute({ path, element }) {
  return isAuthenticated() ? element : <Navigate to="/" />;
}

function App() {
  const logout = () => {
    localStorage.removeItem("token"); // Clear the authentication token
    localStorage.removeItem("newUser"); // Clear the newUser flag
    window.location.href = "/";
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/chat/:friendId" element={<Chat />} />
        <Route path="/profile-setup" element={<ProfileSetupPage />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<UserDashboard />} />}
        />
        <Route
          path="/profile/:userId"
          element={<PrivateRoute element={<UserProfile />} />}
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
      </Routes>
      <button onClick={logout}>Logout</button>
    </Router>
  );
}

export default App;

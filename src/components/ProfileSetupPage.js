// I wrote this code

import React, { useState } from "react";
import "../styles/ProfileSetupPage.css";
import { useNavigate } from "react-router-dom";

function ProfileSetupPage() {
  // State variables to manage user profile setup data
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [profilePicture, setProfilePicture] = useState(null); // Use state for profile picture

  // React Router's `useNavigate` hook to handle navigation
  const navigate = useNavigate();

  // Function to handle profile setup
  const handleProfileSetup = async () => {
    // Create a FormData object to send profile setup data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("location", location);
    formData.append("profile_picture", profilePicture);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/users/create_profile/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        // Profile setup successful
        localStorage.setItem("newUser", "false"); // Mark the user as an existing user
        console.log("Profile saved successfully");
        navigate("/home"); // Redirect to the home page after profile setup
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="profile-setup-page">
      <h1>Complete Your Profile Setup</h1>
      <form encType="multipart/form-data">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />
        </div>
        <button
          type="button"
          className="profile-setup-button"
          onClick={handleProfileSetup}
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default ProfileSetupPage;

// end of code I wrote

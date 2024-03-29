// I wrote this code

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProfileEditPage.css";

function ProfileEditPage() {
  // State variables to manage user profile data
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  // React Router's `useNavigate` hook to handle navigation
  const navigate = useNavigate();

  // Get the `userId` parameter from the route
  const { userId } = useParams();

  // Fetch user profile data when the component loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}/api/users/${userId}/get_profile/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          // Update state with user profile data
          setName(userData.name);
          setBio(userData.bio);
          setLocation(userData.location);
          if (userData.profile_picture) {
            setProfilePicture(userData.profile_picture);
          }
        } else {
          // Handle error
        }
      } catch (error) {
        // Handle error
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Function to handle profile edits
  const handleProfileEdit = async () => {
    // Create a FormData object to send profile data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("location", location);
    formData.append("profile_picture", profilePicture);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/users/${userId}/edit_profile/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        console.log("Profile updated successfully");
        navigate("/home"); // Redirect to the home page after profile update
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="profile-edit-page">
      <h1>Edit Your Profile</h1>
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
          className="profile-edit-button"
          onClick={handleProfileEdit}
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default ProfileEditPage;

// end of code I wrote

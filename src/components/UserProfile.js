// I wrote this code

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/UserProfile.css"; // Import your UserProfile CSS file

function UserProfile({ userId, showEditButton }) {
  // State variable to store user's profile data
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Fetch user's profile data when the component mounts
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.REACT_APP_API}/api/users/${userId}/get_profile/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          console.error("Error fetching profile data");
        }
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };

    fetchProfileData();
  }, [userId]);

  return (
    <div className="profile">
      <h1>Profile</h1>
      {profileData ? (
        <>
          {/* Display profile picture if available */}
          {profileData.profile_picture && (
            <img
              src={`${process.env.REACT_APP_API}${profileData.profile_picture}`}
              alt="Profile"
              className="profile-picture"
            />
          )}
          <p>
            <strong>Username:</strong> {profileData.username}
          </p>
          {/* Display other profile data */}
          <p>
            <strong>Name:</strong> {profileData.name}
          </p>
          <p>
            <strong>Bio:</strong> {profileData.bio}
          </p>
          <p>
            <strong>Location:</strong> {profileData.location}
          </p>
        </>
      ) : (
        <p>No profile setup.</p>
      )}
      {/* "Edit Profile" link if the showEditButton prop is true */}
      {showEditButton && (
        <Link to={`/profile/${userId}/edit`} className="edit-link">
          Edit Profile
        </Link>
      )}
    </div>
  );
}

export default UserProfile;

// end of code I wrote

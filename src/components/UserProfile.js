import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function UserProfile() {
  const { userId } = useParams();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Fetch user's profile data
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}/get_profile/`,
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
          {/* Display profile picture */}
          {profileData.profile_picture && (
            <img
              src={`http://127.0.0.1:8000${profileData.profile_picture}`}
              alt="Profile"
              style={{ maxWidth: "200px" }}
            />
          )}
        </>
      ) : (
        <p>Please set up your profile.</p>
      )}
      <Link to={`/profile/${userId}/edit`}>Edit Profile</Link>
    </div>
  );
}

export default UserProfile;

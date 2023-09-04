import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProfileEditPage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/users/${userId}/get_profile/`, // Adjust the endpoint
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
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

  const handleProfileEdit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("location", location);
    formData.append("profile_picture", profilePicture);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/edit_profile/`, // Adjust the endpoint
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
        navigate(`/profile/${userId}`);
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

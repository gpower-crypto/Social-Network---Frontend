import React, { useState, useEffect } from "react";
import "../styles/Comments.css";

function Comments({ postId, userId }) {
  const [comments, setComments] = useState([]); // State for storing comments
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [editCommentId, setEditCommentId] = useState(null); // State for editing a comment
  const [usernames, setUsernames] = useState({}); // State for storing usernames
  const [editedComment, setEditedComment] = useState(""); // State for edited comment text

  // Function to fetch comments for the given post and user
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/comments/get_comments/?post_id=${postId}&user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error("Error fetching comments");
      }
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId, userId]);

  // Function to fetch usernames for comment authors
  useEffect(() => {
    const fetchUsernames = async () => {
      const allUserIds = Array.from(
        new Set(comments.map((comment) => comment.user))
      );

      const usernamesData = await Promise.all(
        allUserIds.map(async (userId) => {
          const userResponse = await fetch(
            `http://127.0.0.1:8000/api/users/${userId}/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          const userData = await userResponse.json();
          return { id: userId, username: userData.username };
        })
      );

      const usernamesObj = {};
      usernamesData.forEach((userData) => {
        usernamesObj[userData.id] = userData.username;
      });

      setUsernames(usernamesObj);
    };

    fetchUsernames();
  }, [comments]);

  // Function to add a new comment
  const handleAddComment = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/comments/create_comment/?user_id=${userId}&post_id=${postId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: newComment,
          }),
        }
      );

      if (response.ok) {
        const newCommentData = await response.json();
        setComments((prevComments) => [...prevComments, newCommentData]);
        setNewComment("");
      } else {
        console.error("Error adding comment");
      }
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  // Function to edit a comment
  const handleEditComment = async (commentId, newText) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/comments/edit_comment/?user_id=${userId}&comment_id=${commentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: newText,
          }),
        }
      );

      if (response.ok) {
        const updatedCommentData = await response.json();
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === updatedCommentData.id ? updatedCommentData : comment
          )
        );
        setEditCommentId(null);
      } else {
        console.error("Error editing comment");
      }
    } catch (error) {
      console.error("Error editing comment", error);
    }
  };

  // Function to delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/comments/edit_comment/?user_id=${userId}&comment_id=${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment.id !== commentId)
        );
      } else {
        console.error("Error deleting comment");
      }
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };

  return (
    <div className="comments-container">
      <ul className="comment-list">
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <div className="comment-header">
              <span className="username">{usernames[comment.user]}</span>
            </div>
            <div className="comment-text">
              {editCommentId === comment.id ? (
                <div>
                  <input
                    type="text"
                    className="edit-comment-input"
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                  />
                  <button
                    className="save-button"
                    onClick={() => handleEditComment(comment.id, editedComment)}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setEditCommentId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <span>{comment.text}</span>
              )}
            </div>
            <div className="comment-buttons">
              {editCommentId !== comment.id && (
                <>
                  <button
                    className="edit-button"
                    onClick={() => setEditCommentId(comment.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="add-comment">
        <input
          type="text"
          className="add-comment-input"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="add-comment-button" onClick={handleAddComment}>
          Add Comment
        </button>
      </div>
    </div>
  );
}

export default Comments;

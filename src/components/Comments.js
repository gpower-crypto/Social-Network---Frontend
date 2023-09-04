import React, { useState, useEffect } from "react";

function Comments({ postId, userId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editCommentId, setEditCommentId] = useState(null);
  const [usernames, setUsernames] = useState({});

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
    <div className="comments">
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {console.log(comment.id)}
            {editCommentId === comment.id ? (
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            ) : (
              <div>
                Username - {usernames[comment.user]}: {comment.text}
              </div>
            )}
            <button onClick={() => setEditCommentId(comment.id)}>
              {editCommentId === comment.id ? "Cancel" : "Edit"}
            </button>
            <button onClick={() => handleDeleteComment(comment.id)}>
              Delete
            </button>
            {editCommentId === comment.id && (
              <button onClick={() => handleEditComment(comment.id, newComment)}>
                Save
              </button>
            )}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
}

export default Comments;

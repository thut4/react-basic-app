import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        {/* Fancy loader */}
        <div
          style={{
            border: "6px solid #f3f3f3",
            borderTop: "6px solid #4caf50",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (!post) return <p style={{ textAlign: "center" }}>Post not found</p>;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ marginBottom: "16px" }}>{post.title}</h1>
      <p style={{ lineHeight: "1.6", marginBottom: "20px" }}>{post.body}</p>

      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "8px 16px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#6c757d",
          color: "#fff",
          cursor: "pointer",
          transition: "0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#5a6268")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#6c757d")}
      >
        ← Back
      </button>
    </div>
  );
}

export default PostDetail;

import React, {useEffect,useState}  from "react";
import { Link, Routes, Route } from "react-router-dom";
import PostDetail from "./PostDetail";
import { fetchPosts, setPage } from "./postsSlice";
import { useSelector, useDispatch } from "react-redux";


function PostsList() {
  const dispatch = useDispatch();
  const { list, loading, page } = useSelector((state) => state.posts);

  // Keep track of read posts locally
  const [readPosts, setReadPosts] = useState(new Set());

  useEffect(() => {
    // Load from localStorage when component mounts
    const saved = localStorage.getItem("readPosts");
    if (saved) {
      setReadPosts(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    dispatch(fetchPosts(page));
  }, [dispatch, page]);

  const markAsRead = (postId) => {
    const newReadPosts = new Set(readPosts);
    newReadPosts.add(postId);
    setReadPosts(newReadPosts);
    localStorage.setItem("readPosts", JSON.stringify([...newReadPosts]));
  };

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

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Posts (Page {page})</h2>

      {list.map((post) => {
        const isRead = readPosts.has(post.id);

        return (
          <div
            key={post.id}
            style={{
              border: `1px solid ${isRead ? "#4CAF50" : "#ddd"}`,
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              backgroundColor: isRead ? "#f8fff8" : "#fff",
              opacity: isRead ? 0.85 : 1,
            }}
          >
            <h3 style={{ color: isRead ? "#2E7D32" : "#333" }}>{post.title}</h3>
            <p style={{ color: isRead ? "#555" : "#666" }}>
              {post.body.substring(0, 100)}...
            </p>
            <Link to={`/post/${post.id}`} onClick={() => markAsRead(post.id)}>
              <button
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: isRead ? "#4CAF50" : "#007bff",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "0.3s ease",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = isRead
                    ? "#45a049"
                    : "#0056b3")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = isRead
                    ? "#4CAF50"
                    : "#007bff")
                }
              >
                {isRead ? "Read Again" : "Read More"}
              </button>
            </Link>
            {isRead && (
              <span
                style={{
                  marginLeft: "10px",
                  color: "#4CAF50",
                  fontSize: "12px",
                  fontStyle: "italic",
                }}
              >
                ✓ Read
              </span>
            )}
          </div>
        );
      })}

      {/* Pagination */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          disabled={page === 1}
          onClick={() => dispatch(setPage(page - 1))}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: page === 1 ? "#f0f0f0" : "#007bff",
            color: page === 1 ? "#888" : "#fff",
            cursor: page === 1 ? "not-allowed" : "pointer",
            transition: "0.3s ease",
          }}
        >
          Prev
        </button>
        <button
          onClick={() => dispatch(setPage(page + 1))}
          style={{
            marginLeft: "10px",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
            transition: "0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PostsList />} />
      <Route path="/post/:id" element={<PostDetail />} />
    </Routes>
  );
}

export default App;

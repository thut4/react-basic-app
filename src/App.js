import React, {useEffect,useState}  from "react";
import { Link, Routes, Route } from "react-router-dom";
import PostDetail from "./PostDetail";

function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [readPosts, setReadPosts] = useState(new Set());

  useEffect(() => {
    // Load read posts from localStorage
    const savedReadPosts = localStorage.getItem('readPosts');
    if (savedReadPosts) {
      setReadPosts(new Set(JSON.parse(savedReadPosts)));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=5`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, [page]);

  const markAsRead = (postId) => {
    const newReadPosts = new Set(readPosts);
    newReadPosts.add(postId);
    setReadPosts(newReadPosts);
    localStorage.setItem('readPosts', JSON.stringify([...newReadPosts]));
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
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Posts (Page {page})</h2>

      {posts.map((post) => {
        const isRead = readPosts.has(post.id);
        return (
          <div
            key={post.id}
            style={{
              border: `1px solid ${isRead ? '#4CAF50' : '#ddd'}`,
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
              boxShadow: "1 2px 5px rgba(0,0,0,0.3)",
              backgroundColor: isRead ? '#f8fff8' : '#fff',
              opacity: isRead ? 0.8 : 1,
            }}
          >
            <h3 style={{ color: isRead ? '#2E7D32' : '#333' }}>{post.title}</h3>
            <p style={{ color: isRead ? '#555' : '#666' }}>{post.body.substring(0, 100)}...</p>
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
                onMouseOver={(e) => (e.target.style.backgroundColor = isRead ? "#45a049" : "#0056b3")}
                onMouseOut={(e) => (e.target.style.backgroundColor = isRead ? "#4CAF50" : "#007bff")}
              >
                {isRead ? "Read Again" : "Read More"}
              </button>
            </Link>
            {isRead && (
              <span style={{ 
                marginLeft: "10px", 
                color: "#4CAF50", 
                fontSize: "12px",
                fontStyle: "italic"
              }}>
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
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
          onClick={() => setPage((prev) => prev + 1)}
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



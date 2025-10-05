import React, { useState } from "react";
import "./BlogsMain.css";
import { useBlogs } from "../../Hooks/useBlogs";

function BlogsMain() {
  const { blogs, loading, error } = useBlogs();
  const [showMenu, setShowMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);

  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    topic_id: "",
    subtopic_id: "",
    image: "",
  });

  const blogList = blogs || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Blog Submitted:", formData);
    setShowForm(false);
    setFormData({
      title: "",
      content: "",
      topic_id: "",
      subtopic_id: "",
      image: "",
    });
  };

  if (loading) return <p className="loading">Loading blogs...</p>;
  if (error) return <p className="error">Error fetching blogs!</p>;
  if (!blogList.length) return <p className="no-blogs">No blogs found.</p>;

  return (
    <div className="blogs-page">
      
      <div className="banner">
        <h1>Beyond Ayaat</h1>
      </div>

      
      <div className="top-actions">
        <button className="write-btn" onClick={() => setShowForm(true)}>
           Write Your Blog
        </button>

        <div className="profile-section">
          <button
            className="profile-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            Hi, User
          </button>

          {showMenu && (
            <div className="dropdown-menu">
              <button>My Blogs</button>
              <button>Logout</button>
            </div>
          )}
        </div>
      </div>

     
      <div className="blogs-container">
        <h2 className="blogs-heading">All Blogs</h2>

        <div className="blogs-list">
          {blogList.map((blog) => (
            <div className="blog-card" key={blog._id}>
              <img
                src={blog.image?.url?.replace("}", "")}
                alt={blog.title}
                className="blog-image"
              />

              <div className="blog-content">
                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-text">{blog.content.slice(0, 100)}</p>

                <div className="blog-meta">
                  <p className="blog-topic">
                    {blog.topic.title} {blog.topic.description}
                  </p>

                  <p className="blog-author">
                    By {blog.user.first_name} <br /> {blog.user.last_name}
                  </p>
                </div>

                {blog.comments && blog.comments.length > 0 ? (
                  <p className="blog-comments">
                     {blog.comments.content} comment
                    {blog.comments.length > 1 ? "s" : ""}
                  </p>
                ) : (
                  <p className="blog-comments"> No comments yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

     
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2> Create a New Blog</h2>
            <form onSubmit={handleSubmit} className="blog-form">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="content"
                placeholder="Content"
                value={formData.content}
                onChange={handleChange}
                rows="5"
                required
              />
              <input
                type="text"
                name="topic_id"
                placeholder="Topic ID"
                value={formData.topic_id}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="subtopic_id"
                placeholder="Subtopic ID"
                value={formData.subtopic_id}
                onChange={handleChange}
              />
              <input
                type="text"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                   Submit
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                   Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export { BlogsMain };

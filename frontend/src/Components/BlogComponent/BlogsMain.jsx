import React, { useState } from "react";
import "./BlogsMain.css";

function BlogsMain() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="blogs-page">
      {/* Banner */}
      <div className="banner">
        <h1>Beyond Ayaat</h1>
      </div>

      {/* Top Actions */}
      <div className="top-actions">
        <button className="write-btn"> Write Your Blog</button>

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

      {/* Blogs Section */}
      <div className="blogs-container">
        <h2 className="blogs-heading">All Blogs</h2>
        <div className="blogs-list">
          <div className="blog-card">Blog 1 Placeholder</div>
          <div className="blog-card">Blog 2 Placeholder</div>
          <div className="blog-card">Blog 3 Placeholder</div>
          <div className="blog-card">Blog 4 Placeholder</div>
        </div>
      </div>
    </div>
  );
}

export { BlogsMain };

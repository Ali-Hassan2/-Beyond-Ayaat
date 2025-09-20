
import React from 'react';
import './Sign_in.css';


function Sign_in() {
  return (
    <div className="signin-container" style={{ backgroundImage: 'url(../../assets/Home3-Assets/two.jpg)' }}>
      <div className="signin-box">
        <h2>Welcome Back</h2>
        <p>Log in to continue your journey with Quranic knowledge ✨</p>
        <form>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" placeholder="Enter your email" required />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" required />

          <button type="submit">Sign In</button>
        </form>
        <p className="footer-text">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export { Sign_in };

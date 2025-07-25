import React from 'react';
import './Sign_up.css';

function Sign_up() {
  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create Your Account</h2>
        <p className="signup-subtitle">Join us on a journey of Quranic knowledge 🌙</p>
        <form className="signup-form">
          <input type="text" placeholder="First Name" required />
          <input type="text" placeholder="Last Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <p className="login-link">Already have an account? <a href="/login">Login here</a></p>
      </div>
    </div>
  );
}




export { Sign_up };
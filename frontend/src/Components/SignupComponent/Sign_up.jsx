import React, { useState } from 'react';
import axios from 'axios';
import './Sign_up.css';
import { Link } from "react-router-dom";
import { showToast } from '../../Utils';
import { ToastContainer } from 'react-toastify';

function Sign_up() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });


  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage(" Passwords do not match");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3004/user/signup', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        showToast("You have Successfuly Signup !", "success");
      
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          confirmPassword: ''


        });
      } else {
        setMessage(response.data.message || "Signup failed");
      }
    } catch (error) {
      setMessage( (error.response?.data?.message || "Server error"));
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Sign Up</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signup-button">Register</button>
        </form>
        {message && <p className="signup-message">{message}</p>}
        <p className="login-link">
          Already have an account? <Link to="/signin">Login here</Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}




export { Sign_up };

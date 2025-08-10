import React, { useState } from "react";
import axios from "axios";


import "./AdminSignup.css";

 function AdminSign_up() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const validate = () => {
    if (!form.first_name.trim() || !form.last_name.trim()) return "Please enter first and last name.";
    if (!form.email.includes('@')) return "Please enter a valid email.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }

    setLoading(true);
    setError('');
    try {
      const resp = await fetch('http://localhost:4001/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password
        })
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || 'Signup failed');

      setSuccess(data.message || 'Admin account created successfully');
      setForm({ first_name: '', last_name: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-signup-wrap">
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <form className="admin-card" onSubmit={handleSubmit} noValidate>
        <div className="brand">
          <h1>Beyon <span>Ayaat</span></h1>
          <p className="tag">Admin Registration</p>
        </div>

        <div className="inputs-grid">
          <label className="float-label">
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
            />
            <span>First Name</span>
          </label>

          <label className="float-label">
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
            />
            <span>Last Name</span>
          </label>

          <label className="float-label full">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <span>Email Address</span>
          </label>

          <label className="float-label">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span>Password</span>
          </label>

          <label className="float-label">
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <span>Confirm Password</span>
          </label>
        </div>

        <div className="actions">
          <button type="submit" className="btn" disabled={loading}>
            <span className="btn-ink" />
            {loading ? 'Creating...' : 'Create Admin'}
          </button>
        </div>

        <div className="status">
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </div>

        <div className="note">
          <small>Admins can manage posts, approve content and moderate the community. Keep credentials secure.</small>
        </div>

      </form>
    </div>
  );
}

export { AdminSign_up };

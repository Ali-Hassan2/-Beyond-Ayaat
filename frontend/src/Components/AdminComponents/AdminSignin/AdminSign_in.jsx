import React, { useState } from "react";
import './AdminSignin.css';

 function AdminSign_in() {
  const [form, setForm] = useState({
    email: '',
    password: ''
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
    if (!form.email.includes('@')) return "Please enter a valid email.";
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) { setError(v); return; }

    setLoading(true);
    setError('');
    try {
      const resp = await fetch('http://localhost:3004/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      const data = await resp.json();
      
      if (!resp.ok) throw new Error(data.message || 'Login failed');

      // Assuming the backend returns { success, token, user, message }
      if (data.success) {
        console.log("user data", data);

        localStorage.setItem("admintoken", data.token);
        localStorage.setItem("admin", JSON.stringify(data.admin));

        setSuccess(data.message || 'Admin logged in successfully');
        setForm({ email: '', password: '' });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <form className="admin-card" onSubmit={handleSubmit} noValidate>
        <div className="brand">
          <h1>Beyon <span>Ayaat</span></h1>
          <p className="tag">Admin Login</p>
        </div>

        <div className="inputs-grid">
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

          <label className="float-label full">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span>Password</span>
          </label>
        </div>

        <div className="actions">
          <button type="submit" className="btn" disabled={loading}>
            <span className="btn-ink" />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <div className="status">
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </div>

        <div className="note">
          <small>Admins can access dashboard and manage the platform securely.</small>
        </div>
      </form>
    </div>
  );
}

export { AdminSign_in };
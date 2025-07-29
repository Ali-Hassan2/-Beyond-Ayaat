import React, { useState } from "react";
import "./Sign_in.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../../api/google_api";
function Sign_in() {
  const navigate = useNavigate();
  const [token, settoken] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3004/user/login",
        formData
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Password is incorrect.Try again.");
    }
  };

  const handlegoogle = async (authResult) => {
    try {
      if (authResult?.code) {
        const result = await googleAuth(authResult.code);
        const { user, token } = result.data.data;
        if (!user) {
          setError("Google login failed: no user info");
          return;
        }
        const obj = {
          email: user.email,
          name: user.name,
          picture: user.picture,
          token: token,
        };
        settoken(obj);
        localStorage.setItem("user-info-google", JSON.stringify(obj));
        localStorage.setItem("google-token", token);
        console.log("Login Successfull");
        navigate("/");
      }
    } catch (error) {
      console.log("There is an error.", error?.response?.data || error.message);
      setError(error?.response?.data?.message || "Google login failed");
    }
  };

  const googlelogin = useGoogleLogin({
    onSuccess: handlegoogle,
    onError: handlegoogle,
    flow: "auth-code",
  });
  return (
    <div
      className="signin-container"
      style={{ backgroundImage: "url(../../assets/Home3-Assets/two.jpg)" }}
    >
      <div className="signin-box">
        <h2>Welcome Back</h2>
        <p>
          Log in to continue your journey with <br /> Quranic knowledge ✨
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Sign In</button>
          <button type="button" onClick={googlelogin}>
            Continue with Google
          </button>
        </form>

        <p className="footer-text">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export { Sign_in };

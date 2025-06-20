import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import signupImg from "../../Images/signup.jpg";
import logo from "../../Images/chatterlyIcon.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Signin.scss";
// import "./Signup.css"; // custom CSS for styling

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://promptly-backend-5.onrender.com/users/saveUser", {
        name:name,
        email:email,
        password:password,
      });

      if (response.data.success) {
        setName("");
        setEmail("");
        setPassword("");
        navigate("/login");
      } else {
        alert("Signup failed: " + response.message);
      }
    } catch (error) {
      console.error("Manual signup error:", error);
    }
  };

  const googleSignup = () => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID",
      callback: handleCredentialResponse,
    });

    google.accounts.id.prompt();
  };

  const handleCredentialResponse = async (response) => {
    try {
      const decoded = jwtDecode(response.credential);

      const payload = {
        name: decoded.name,
        email: decoded.email,
        googleProfile: {
          id: decoded.sub,
        },
      };

      const res = await axios.post("https://promptly-backend-5.onrender.com/user/signup", payload);
      if (res.data.success) {
        setName("");
        setEmail("");
        setPassword("");
        navigate("/login");
      } else {
        alert("Signup failed: " + res.data.message);
      }
    } catch (error) {
      console.error("Google signup error:", error);
      alert("Google signup failed.");
    }
  };

  return (
    <div className="signup-container d-flex align-items-center justify-content-center">
      <div className="signup-card d-flex">
        {/* Left Side - Image */}
        <div className="image-section d-none d-md-block">
          <img src={signupImg} alt="Signup Illustration" className="rounded-start" />
        </div>

        {/* Right Side - Form */}
        <div className="form-section p-4">
          <h2 className="text-center fw-bold mb-3">
            <img src={logo} alt="Lo" className="mb-2 logo-img" /> Create Your Account
          </h2>

          <form onSubmit={signup}>
            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label text-start w-100">Full Name</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label text-start w-100">Email Address</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label text-start w-100">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Signup Button */}
            <button type="submit" className="btn btn-primary w-100 py-2">
              Sign Up
            </button>

            {/* Google Sign-In */}
            <button
              type="button"
              className="btn btn-outline-dark w-100 py-2 mt-3 d-flex align-items-center justify-content-center"
              onClick={googleSignup}
            >
              <img
                src="https://img.icons8.com/color/16/000000/google-logo.png"
                className="me-2"
                alt="Google Logo"
              />
              Sign Up with Google
            </button>

            <p className="text-center mt-3">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

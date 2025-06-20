import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import loginImage from "../../Images/login.jpg";
import logo from "../../Images/chatterlyIcon.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.scss"; // custom styles
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      'https://promptly-backend-5.onrender.com/users/login',
      {
        email:email,
        password:password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if(response.data.message==="Login successful")
    {
      sessionStorage.setItem("userId", response.data.userDetails.id);
      sessionStorage.setItem("userName", response.data.userDetails.name);
      navigate('/');
      // window.location.reload();
    }

  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    alert(error.response?.data?.message || 'Login failed');
  }
};


  const googleLogin = () => {
    navigate("/");
  };

  return (
    <div className="container-fluid login-container">
      <div className="row vh-100 d-flex justify-content-center align-items-center">
        <div className="card col-12 col-sm-12 col-md-8 col-lg-7 shadow-lg border-0 p-0">
          <div className="row g-0">
            {/* Left Side (Image) */}
            <div className="col-md-6 d-none d-md-block m-auto">
              <img
                src={loginImage}
                className="rounded-start"
                width="100%"
                height="100%"
                alt="Login"
              />
            </div>

            {/* Right Side (Form) */}
            <div className="col-md-6 p-4 d-flex flex-column justify-content-center">
              {/* Small Logo */}
              <div className="text-center">
                <img src={logo} alt="Logo" className="mb-2 logo-img" />
              </div>

              <h2 className="text-center fw-bold">Welcome Back!</h2>
              <p className="text-center text-muted">Login to continue</p>

              <form onSubmit={handleLogin}>
                {/* Email */}
                <div className="mb-3 input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-3 input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Login Button */}
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>

                <div className="text-center my-3">OR</div>

                {/* Google Login */}
                <button
                  type="button"
                  className="btn btn-outline-dark w-100"
                  onClick={googleLogin}
                >
                  <img
                    src="https://img.icons8.com/color/16/000000/google-logo.png"
                    className="me-2"
                    alt="Google Logo"
                  />
                  Login with Google
                </button>

                <p className="text-center mt-3">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-decoration-none">
                    Sign Up
                  </Link>
                </p>

                {/* Back to Home */}
                <p className="text-center mt-2">
                  <Link to="/" className="btn btn-link text-decoration-none">
                    ⬅ Back to Home
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

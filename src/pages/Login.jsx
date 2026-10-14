
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { triggerGoogleLogin } = useGoogleAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    try {
      const response = await fetch(
        "http://localhost:8081/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Invalid email or password.");
        return;
      }

      // Store user information returned from backend
      localStorage.setItem(
        "skillswapUser",
        JSON.stringify({
          id: data.id,
          name: data.name,
          email: data.email,
          location: data.location || "India",
          bio: data.bio || "",
        })
      );

      // Basic frontend login state for the prototype.
      localStorage.setItem("skillswapLoggedIn", "true");

      alert("Login successful! Welcome to SkillSwap.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert(
        "Cannot connect to the server. Make sure your backend is running."
      );
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    triggerGoogleLogin(
      (userData) => {
        setGoogleLoading(false);
        navigate("/dashboard");
      },
      (err) => {
        setGoogleLoading(false);
        alert(err.message || "Google login failed. Please try again.");
      }
    );
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <section className="login-intro">
          <div className="brand-mark">S</div>

          <p className="login-label">WELCOME TO SKILLSWAP</p>

          <h1>
            Learn from people.
            <br />
            <span>Share what you know.</span>
          </h1>

          <p>
            SkillSwap helps people connect, exchange
            knowledge and learn useful skills from
            each other.
          </p>
        </section>

        <section className="login-card">
          <div className="login-card-header">
            <h2>Welcome back</h2>
            <p>
              Sign in to continue to your SkillSwap account.
            </p>
          </div>

          <button
            type="button"
            className="google-button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            <span className="google-icon">G</span>
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          <div className="login-divider">
            <span>OR CONTINUE WITH EMAIL</span>
          </div>

          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />

            <div className="password-label">
              <label htmlFor="password">Password</label>

              <button
                type="button"
                className="forgot-password"
                onClick={() =>
                  alert("Password reset will be added later.")
                }
              >
                Forgot password?
              </button>
            </div>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
            />

            <button type="submit" className="login-button">
              Sign in
            </button>
          </form>

          <p className="register-text">
            Don't have an account?{" "}
            <Link to="/register">Create one</Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default Login;

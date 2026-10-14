
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { triggerGoogleLogin } = useGoogleAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8081/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed. Please try again."
        );
      }

      alert("Account created successfully!");

      // Do not store the password in localStorage.
      navigate("/login");
    } catch (error) {
      if (error instanceof TypeError) {
        alert(
          "Cannot connect to SkillSwap server. Make sure your backend is running."
        );
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setGoogleLoading(true);
    triggerGoogleLogin(
      (userData) => {
        setGoogleLoading(false);
        navigate("/dashboard");
      },
      (err) => {
        setGoogleLoading(false);
        alert(err.message || "Google signup failed. Please try again.");
      }
    );
  };

  return (
    <main className="login-page">
      <div className="login-container">

        {/* LEFT SIDE */}

        <section className="login-intro">
          <div className="brand-mark">S</div>

          <p className="login-label">
            JOIN SKILLSWAP
          </p>

          <h1>
            Your skills can
            <br />
            <span>help someone.</span>
          </h1>

          <p>
            Create your SkillSwap account and discover
            people who can teach you while sharing the
            knowledge you already have.
          </p>
        </section>

        {/* RIGHT SIDE */}

        <section className="login-card">
          <div className="login-card-header">
            <h2>Create your account</h2>

            <p>
              Join the SkillSwap community today.
            </p>
          </div>

          {/* GOOGLE */}

          <button
            type="button"
            className="google-button"
            onClick={handleGoogleRegister}
            disabled={googleLoading}
          >
            <span className="google-icon">G</span>
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          {/* DIVIDER */}

          <div className="login-divider">
            <span>OR SIGN UP WITH EMAIL</span>
          </div>

          {/* REGISTER FORM */}

          <form onSubmit={handleRegister}>
            <label htmlFor="name">
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              required
            />

            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              minLength={8}
              required
            />

            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              minLength={8}
              required
            />

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* LOGIN LINK */}

          <p className="register-text">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default Register;

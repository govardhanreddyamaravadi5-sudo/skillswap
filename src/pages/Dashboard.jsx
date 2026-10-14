import { Link } from "react-router-dom";
import React from "react";
import "./Dashboard.css";

function Dashboard() {
  const savedUser = localStorage.getItem("skillswapUser");

  const user = savedUser
    ? JSON.parse(savedUser)
    : { name: "User", email: "" };

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">
        <p className="section-label">DASHBOARD</p>

        <h1>
          Welcome, {user.name} 👋
        </h1>

        <p>
          Find people to learn from and share your own skills
          with the SkillSwap community.
        </p>
      </div>


      <div className="dashboard-grid">

        {/* PROFILE */}

        <div className="dashboard-card">

          <div className="dashboard-icon">
            👤
          </div>

          <h2>My Profile</h2>

          <p>
            Update your personal information and tell the
            community about yourself.
          </p>

          <Link
            to="/profile"
            className="dashboard-link"
          >
            View Profile →
          </Link>

        </div>


        {/* MY SKILLS */}

        <div className="dashboard-card">

          <div className="dashboard-icon">
            💡
          </div>

          <h2>My Skills</h2>

          <p>
            Add skills you can teach and skills you want
            to learn.
          </p>

          <Link
            to="/my-skills"
            className="dashboard-link"
          >
            Manage Skills →
          </Link>

        </div>


        {/* FIND SKILLS */}

        <div className="dashboard-card">

          <div className="dashboard-icon">
            🔍
          </div>

          <h2>Find Skills</h2>

          <p>
            Discover people who have skills that you want
            to learn.
          </p>

          <Link
            to="/find-skills"
            className="dashboard-link"
          >
            Explore Skills →
          </Link>

        </div>


        {/* REQUESTS */}

        <div className="dashboard-card">

          <div className="dashboard-icon">
            🔄
          </div>

          <h2>Swap Requests</h2>

          <p>
            View your incoming and outgoing skill exchange
            requests.
          </p>

          <Link
            to="/requests"
            className="dashboard-link"
          >
            View Requests →
          </Link>

        </div>

      </div>


      {/* QUICK ACTIONS */}

      <div className="quick-section">

        <h2>Quick Actions</h2>

        <div className="quick-actions">

          <Link to="/find-skills">
            Find Someone to Learn From
          </Link>

          <Link to="/my-skills">
            Add a New Skill
          </Link>

          <Link to="/profile">
            Complete My Profile
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
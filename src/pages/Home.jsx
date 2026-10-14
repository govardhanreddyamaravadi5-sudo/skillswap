import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { authService } from "../services/api";

function Home() {
  const isLoggedIn = !!authService.getCurrentUser();
  const getStartedPath = isLoggedIn ? "/dashboard" : "/register";
  return (
    <div className="home-page">

      {/* =========================
          HERO SECTION
          ========================= */}

      <section className="home-hero">

        <div className="home-hero-content">

          <p className="home-eyebrow">
            LEARN • SHARE • CONNECT
          </p>

          <h1>
            Your skills are
            <br />
            <span>worth sharing.</span>
          </h1>

          <p className="home-description">
            SkillSwap helps you find people who can teach
            you something new while you share the skills
            you already know.
          </p>

          <div className="home-buttons">

            <Link
              to="/find-skills"
              className="home-primary-button"
            >
              Find a Skill
              <span>→</span>
            </Link>

            <Link
              to="/my-skills"
              className="home-secondary-button"
            >
              Share Your Skills
            </Link>

          </div>

        </div>


        {/* HERO VISUAL */}

        <div className="home-hero-visual">

          <div className="hero-circle hero-circle-one"></div>

          <div className="hero-circle hero-circle-two"></div>


          {/* CENTER CARD */}

          <div className="hero-center-card">

            <div className="hero-center-icon">
              ⇄
            </div>

            <strong>
              SkillSwap
            </strong>

            <span>
              Exchange knowledge
            </span>

          </div>


          {/* FLOATING CARD 1 */}

          <div className="hero-floating-card card-one">

            <div className="floating-icon">
              💻
            </div>

            <div>
              <strong>
                React
              </strong>

              <span>
                Can teach
              </span>
            </div>

          </div>


          {/* FLOATING CARD 2 */}

          <div className="hero-floating-card card-two">

            <div className="floating-icon">
              🎨
            </div>

            <div>
              <strong>
                UI/UX Design
              </strong>

              <span>
                Wants to learn
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* =========================
          HOW IT WORKS
          ========================= */}

      <section className="home-how">

        <div className="home-section-heading">

          <p className="home-eyebrow">
            HOW IT WORKS
          </p>

          <h2>
            Skill swapping is
            <span> simple.</span>
          </h2>

          <p>
            No complicated process. Just find someone,
            connect, and start learning.
          </p>

        </div>


        <div className="home-steps">

          {/* STEP 1 */}

          <div className="home-step">

            <div className="step-number">
              01
            </div>

            <h3>
              Find someone
            </h3>

            <p>
              Search for a person who knows the skill
              you want to learn.
            </p>

          </div>


          {/* STEP 2 */}

          <div className="home-step">

            <div className="step-number">
              02
            </div>

            <h3>
              See the match
            </h3>

            <p>
              Check what they can teach and what they
              want to learn from you.
            </p>

          </div>


          {/* STEP 3 */}

          <div className="home-step">

            <div className="step-number">
              03
            </div>

            <h3>
              Start swapping
            </h3>

            <p>
              Send a request, connect, and exchange
              your knowledge.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          BENEFITS
          ========================= */}

      <section className="home-benefits">

        <div className="benefit-text">

          <p className="home-eyebrow">
            WHY SKILLSWAP
          </p>

          <h2>
            Learn from people.
            <br />
            <span>Share what you know.</span>
          </h2>

          <p>
            SkillSwap makes it easy to connect with
            people who have the skills you want to learn
            and are interested in the skills you can share.
          </p>

          <Link
            to="/find-skills"
            className="benefit-link"
          >
            Explore skills
            <span>→</span>
          </Link>

        </div>


        <div className="benefit-cards">

          {/* BENEFIT 1 */}

          <div className="benefit-card">

            <div className="benefit-icon">
              🔍
            </div>

            <h3>
              Find the right person
            </h3>

            <p>
              Search for people based on the skills
              you want to learn.
            </p>

          </div>


          {/* BENEFIT 2 */}

          <div className="benefit-card">

            <div className="benefit-icon">
              🤝
            </div>

            <h3>
              Exchange knowledge
            </h3>

            <p>
              Share your skills while learning
              something new.
            </p>

          </div>


          {/* BENEFIT 3 */}

          <div className="benefit-card">

            <div className="benefit-icon">
              💬
            </div>

            <h3>
              Connect and learn
            </h3>

            <p>
              Communicate with your connections
              and learn together.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          FINAL CTA
          ========================= */}

      <section className="home-cta">

        <p className="home-eyebrow">
          READY TO START?
        </p>

        <h2>
          Your next skill is
          <span> one connection away.</span>
        </h2>

        <p>
          Join SkillSwap and start learning from
          people around you.
        </p>

        <Link
          to={getStartedPath}
          className="home-cta-button"
        >
          {isLoggedIn ? "Go to Dashboard" : "Get Started"}
          <span>→</span>
        </Link>

      </section>


      {/* =========================
          FOOTER
          ========================= */}

      <footer className="home-footer">

        <div>

          <strong>
            Skill<span>Swap</span>
          </strong>

          <p>
            Learn. Share. Connect.
          </p>

        </div>


        <div className="footer-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/find-skills">
            Find Skills
          </Link>

          <Link to={getStartedPath}>
            {isLoggedIn ? "Dashboard" : "Get Started"}
          </Link>

        </div>

      </footer>

    </div>
  );
}

export default Home;
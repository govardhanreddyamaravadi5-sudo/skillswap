import { useState, useEffect } from "react";
import "./Profile.css";
import { usersService, authService } from "../services/api";

function Profile() {
  const currentUser = authService.getCurrentUser() || { name: "User", email: "" };

  const [name, setName] = useState(currentUser.name || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [location, setLocation] = useState(currentUser.location || "India");

  useEffect(() => {
    if (currentUser?.id) {
      usersService.getProfile(currentUser.id).then((profile) => {
        if (profile) {
          if (profile.name) setName(profile.name);
          if (profile.email) setEmail(profile.email);
          if (profile.bio) setBio(profile.bio);
          if (profile.location) setLocation(profile.location);

          const cached = authService.getCurrentUser() || {};
          authService.setCurrentUser({ ...cached, ...profile });
        }
      }).catch(console.warn);
    }
  }, [currentUser?.id]);

  const handleSave = async (e) => {
    e.preventDefault();

    const updatedUser = {
      ...currentUser,
      name,
      email,
      bio,
      location,
    };

    try {
      if (currentUser?.id) {
        await usersService.updateProfile(currentUser.id, { name, bio, location });
      }
    } catch (err) {
      console.warn("Backend profile update error:", err);
    }

    authService.setCurrentUser(updatedUser);
    alert("Profile updated successfully!");
  };

  const initial =
    name.trim().charAt(0).toUpperCase() || "U";

  return (
    <main className="profile-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <section className="profile-header">

        <p className="section-label">
          MY PROFILE
        </p>

        <h1>
          Your profile
        </h1>

        <p>
          Tell the SkillSwap community a little about
          yourself and the skills you want to exchange.
        </p>

      </section>


      {/* =========================
          PROFILE LAYOUT
      ========================= */}

      <div className="profile-layout">

        {/* =========================
            PROFILE CARD
        ========================= */}

        <section className="profile-card">

          <div className="profile-avatar">
            {initial}
          </div>

          <h2>
            {name || "Your Name"}
          </h2>

          <p className="profile-email">
            {email}
          </p>

          <div className="profile-status">
            <span></span>
            SkillSwap member
          </div>

        </section>


        {/* =========================
            EDIT PROFILE
        ========================= */}

        <section className="profile-form-card">

          <div className="profile-form-header">

            <h2>
              Personal information
            </h2>

            <p>
              Keep your information up to date.
            </p>

          </div>


          <form onSubmit={handleSave}>

            {/* NAME */}

            <div className="form-group">

              <label htmlFor="profile-name">
                Full name
              </label>

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your full name"
                required
              />

            </div>


            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="profile-email">
                Email address
              </label>

              <input
                id="profile-email"
                type="email"
                value={email}
                disabled
              />

              <small>
                Your email address cannot be changed here.
              </small>

            </div>


            {/* LOCATION */}

            <div className="form-group">

              <label htmlFor="profile-location">
                Location
              </label>

              <input
                id="profile-location"
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="e.g. Hyderabad, India"
              />

            </div>


            {/* BIO */}

            <div className="form-group">

              <label htmlFor="profile-bio">
                About you
              </label>

              <textarea
                id="profile-bio"
                value={bio}
                onChange={(e) =>
                  setBio(e.target.value)
                }
                placeholder="Tell people about yourself, your interests and what you enjoy learning..."
                rows="5"
              />

            </div>


            {/* SAVE */}

            <button
              type="submit"
              className="profile-save-button"
            >
              Save changes
            </button>

          </form>

        </section>

      </div>

    </main>
  );
}

export default Profile;
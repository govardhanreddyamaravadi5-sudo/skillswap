import { useMemo, useState, useEffect } from "react";
import "./FindSkills.css";
import { usersService, requestsService, authService } from "../services/api";

function FindSkills() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [communityProfiles, setCommunityProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    async function loadCommunity() {
      try {
        setLoading(true);
        const data = await usersService.getCommunity(currentUser?.id);
        if (data && Array.isArray(data) && data.length > 0) {
          // Flatten / map community profiles for display
          const mapped = data.map((u) => {
            const mainSkill = u.teaches?.[0]?.name || "Skills Exchanger";
            const cat = u.teaches?.[0]?.category || "Technology";
            const lvl = u.teaches?.[0]?.level || "Intermediate";
            return {
              id: u.id,
              name: u.name,
              email: u.email,
              location: u.location || "India",
              bio: u.bio,
              skill: mainSkill,
              category: cat,
              level: lvl,
              teaches: u.teaches || [],
              learns: u.learns || [],
            };
          });
          setCommunityProfiles(mapped);
          localStorage.setItem("skillSwapProfiles", JSON.stringify(mapped));
        } else {
          const cached = localStorage.getItem("skillSwapProfiles");
          if (cached) setCommunityProfiles(JSON.parse(cached));
        }
      } catch (err) {
        console.warn("Could not load backend profiles, using cache", err);
        const cached = localStorage.getItem("skillSwapProfiles");
        if (cached) setCommunityProfiles(JSON.parse(cached));
      } finally {
        setLoading(false);
      }
    }
    loadCommunity();
  }, [currentUser?.id]);

  const otherProfiles = useMemo(() => {
    return communityProfiles.filter(
      (profile) => !currentUser || profile.email !== currentUser.email
    );
  }, [communityProfiles, currentUser]);

  // Search and filter
  const filteredUsers = useMemo(() => {
    return otherProfiles.filter((user) => {
      const text = search.toLowerCase().trim();

      const matchesSearch =
        text === "" ||
        user.name?.toLowerCase().includes(text) ||
        user.skill?.toLowerCase().includes(text) ||
        user.teaches?.some((skill) =>
          typeof skill === "string"
            ? skill.toLowerCase().includes(text)
            : skill.name?.toLowerCase().includes(text)
        );

      const matchesCategory =
        category === "All" || user.category === category;

      const matchesLevel =
        level === "All" || user.level === level;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [search, category, level, otherProfiles]);

  // Send request
  const sendRequest = async (user) => {
    if (!currentUser?.id) {
      alert("Please log in to send a swap request.");
      return;
    }

    const savedSentRequests = localStorage.getItem("sentRequests");
    const sentRequests = savedSentRequests ? JSON.parse(savedSentRequests) : [];

    const alreadySent = sentRequests.some((request) => request.userId === user.id);
    if (alreadySent) {
      alert("You have already sent a request to this user.");
      return;
    }

    try {
      const payload = {
        fromUserId: currentUser.id,
        toUserId: user.id,
        skillName: user.skill || "Skill Exchange",
        message: `I would like to learn ${user.skill} from you.`,
      };

      const serverReq = await requestsService.createRequest(payload);

      const newRequest = {
        id: serverReq.id,
        userId: user.id,
        name: user.name,
        skill: user.skill,
        message: serverReq.message,
        date: "Today",
        status: "Pending",
        fromUser: currentUser.name,
        fromEmail: currentUser.email,
      };

      const updatedSentRequests = [...sentRequests, newRequest];
      localStorage.setItem("sentRequests", JSON.stringify(updatedSentRequests));

      setSelectedUser(null);
      alert(`Request sent to ${user.name} successfully!`);
    } catch (err) {
      alert("Notice: " + err.message);
    }
  };

  return (
    <main className="find-skills-page">

      {/* HEADER */}

      <section className="find-skills-header">

        <p className="section-label">
          DISCOVER SKILLS
        </p>

        <h1>
          Find someone to
          <span> learn from.</span>
        </h1>

        <p>
          Discover people in the SkillSwap
          community who can teach you something
          useful.
        </p>

      </section>


      {/* SEARCH */}

      <section className="skills-search-box">

        <div className="skill-search">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search for a skill or person..."
          />

        </div>


        <div className="skill-filters">

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            <option value="All">
              All categories
            </option>

            <option value="Technology">
              Technology
            </option>

            <option value="Design">
              Design
            </option>

            <option value="Creative">
              Creative
            </option>

            <option value="Business">
              Business
            </option>

            <option value="Languages">
              Languages
            </option>

          </select>


          <select
            value={level}
            onChange={(e) =>
              setLevel(e.target.value)
            }
          >

            <option value="All">
              All levels
            </option>

            <option value="Beginner">
              Beginner
            </option>

            <option value="Intermediate">
              Intermediate
            </option>

            <option value="Advanced">
              Advanced
            </option>

          </select>

        </div>

      </section>


      {/* RESULTS */}

      <div className="skills-results-header">

        <div>

          <h2>
            People you can learn from
          </h2>

          <p>
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1
              ? "person"
              : "people"}{" "}
            found
          </p>

        </div>

      </div>


      {/* NO USERS OR LOADING */}

      {loading ? (

        <div className="no-skill-results">

          <div>
            ⏳
          </div>

          <h3>
            Loading SkillSwap members...
          </h3>

          <p>
            Fetching community members from server.
          </p>

        </div>

      ) : filteredUsers.length === 0 ? (

        <div className="no-skill-results">

          <div>
            🔎
          </div>

          <h3>
            No SkillSwap members found
          </h3>

          <p>
            Try another search or add more skills
            to your profile.
          </p>

        </div>

      ) : (

        <div className="skill-users-grid">

          {filteredUsers.map((user) => (

            <article
              className="skill-user-card"
              key={user.id}
            >

              {/* USER */}

              <div className="skill-user-top">

                <div className="skill-user-avatar">

                  {user.name
                    ?.charAt(0)
                    .toUpperCase()}

                </div>


                <div className="skill-user-info">

                  <h3>
                    {user.name}
                  </h3>

                  <p>
                    📍{" "}
                    {user.location ||
                      "India"}
                  </p>

                </div>

              </div>


              {/* MAIN SKILL */}

              <div className="main-skill">

                <span className="skill-category">
                  {user.category ||
                    "General"}
                </span>

                <h2>
                  {user.skill}
                </h2>

                <span className="skill-level">
                  {user.level ||
                    "Intermediate"}
                </span>

              </div>


              {/* TEACHES */}

              <div className="teaches-section">

                <p>
                  Can teach
                </p>

                <div className="skill-tags">

                  {user.teaches?.map(
                    (skill, index) => {

                      const skillName =
                        typeof skill === "string"
                          ? skill
                          : skill.name;

                      return (
                        <span
                          key={
                            `${skillName}-${index}`
                          }
                        >
                          {skillName}
                        </span>
                      );
                    }
                  )}

                </div>

              </div>


              {/* BUTTONS */}

              <div className="skill-card-actions">

                <button
                  type="button"
                  className="view-profile-button"
                  onClick={() =>
                    setSelectedUser(user)
                  }
                >
                  View details
                </button>


                <button
                  type="button"
                  className="send-request-button"
                  onClick={() =>
                    sendRequest(user)
                  }
                >
                  Request swap
                </button>

              </div>

            </article>

          ))}

        </div>

      )}


      {/* DETAILS MODAL */}

      {selectedUser && (

        <div
          className="skill-modal-overlay"
          onClick={() =>
            setSelectedUser(null)
          }
        >

          <div
            className="skill-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setSelectedUser(null)
              }
            >
              ×
            </button>


            <div className="modal-user">

              <div className="modal-avatar">

                {selectedUser.name
                  ?.charAt(0)
                  .toUpperCase()}

              </div>

              <div>

                <h2>
                  {selectedUser.name}
                </h2>

                <p>
                  📍{" "}
                  {selectedUser.location ||
                    "India"}
                </p>

              </div>

            </div>


            <div className="modal-skill">

              <span>
                {selectedUser.category ||
                  "General"}
              </span>

              <h3>
                {selectedUser.skill}
              </h3>

              <small>
                {selectedUser.level ||
                  "Intermediate"}
              </small>

            </div>


            <div className="modal-section">

              <h4>
                Skills they can teach
              </h4>

              <div className="skill-tags">

                {selectedUser.teaches?.map(
                  (skill, index) => {

                    const skillName =
                      typeof skill === "string"
                        ? skill
                        : skill.name;

                    return (
                      <span
                        key={
                          `${skillName}-${index}`
                        }
                      >
                        {skillName}
                      </span>
                    );
                  }
                )}

              </div>

            </div>


            <button
              type="button"
              className="send-request-button modal-button"
              onClick={() =>
                sendRequest(selectedUser)
              }
            >
              Send skill swap request
            </button>

          </div>

        </div>

      )}

    </main>
  );
}

export default FindSkills;
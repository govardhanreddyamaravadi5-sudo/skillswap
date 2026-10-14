import { useState, useEffect } from "react";
import "./Myskills.css";
import { skillsService, authService } from "../services/api";

function MySkills() {
  const currentUser = authService.getCurrentUser();

  const [teachSkills, setTeachSkills] = useState(() => {
    const saved = localStorage.getItem("teachSkills");
    return saved ? JSON.parse(saved) : [];
  });

  const [learnSkills, setLearnSkills] = useState(() => {
    const saved = localStorage.getItem("learnSkills");
    return saved ? JSON.parse(saved) : [];
  });

  const [teachName, setTeachName] = useState("");
  const [teachCategory, setTeachCategory] = useState("Technology");
  const [teachLevel, setTeachLevel] = useState("Beginner");

  const [learnName, setLearnName] = useState("");
  const [learnCategory, setLearnCategory] = useState("Technology");
  const [learnLevel, setLearnLevel] = useState("Beginner");

  const [loading, setLoading] = useState(false);

  // Load skills from backend on mount
  useEffect(() => {
    if (currentUser?.id) {
      skillsService.getUserSkills(currentUser.id).then((serverSkills) => {
        if (serverSkills && Array.isArray(serverSkills)) {
          const teach = serverSkills.filter((s) => s.skillType === "TEACH");
          const learn = serverSkills.filter((s) => s.skillType === "LEARN");
          setTeachSkills(teach);
          setLearnSkills(learn);
          localStorage.setItem("teachSkills", JSON.stringify(teach));
          localStorage.setItem("learnSkills", JSON.stringify(learn));
        }
      });
    }
  }, [currentUser?.id]);

  const addTeachSkill = async (e) => {
    e.preventDefault();
    if (!teachName.trim()) return;

    const skillPayload = {
      name: teachName.trim(),
      category: teachCategory,
      level: teachLevel,
      skillType: "TEACH",
    };

    try {
      setLoading(true);
      if (currentUser?.id) {
        const saved = await skillsService.addSkill(currentUser.id, skillPayload);
        const updated = [...teachSkills, saved];
        setTeachSkills(updated);
        localStorage.setItem("teachSkills", JSON.stringify(updated));
      } else {
        const fallback = { ...skillPayload, id: Date.now() };
        const updated = [...teachSkills, fallback];
        setTeachSkills(updated);
        localStorage.setItem("teachSkills", JSON.stringify(updated));
      }
      setTeachName("");
    } catch (err) {
      alert("Error saving skill to backend: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addLearnSkill = async (e) => {
    e.preventDefault();
    if (!learnName.trim()) return;

    const skillPayload = {
      name: learnName.trim(),
      category: learnCategory,
      level: learnLevel,
      skillType: "LEARN",
    };

    try {
      setLoading(true);
      if (currentUser?.id) {
        const saved = await skillsService.addSkill(currentUser.id, skillPayload);
        const updated = [...learnSkills, saved];
        setLearnSkills(updated);
        localStorage.setItem("learnSkills", JSON.stringify(updated));
      } else {
        const fallback = { ...skillPayload, id: Date.now() };
        const updated = [...learnSkills, fallback];
        setLearnSkills(updated);
        localStorage.setItem("learnSkills", JSON.stringify(updated));
      }
      setLearnName("");
    } catch (err) {
      alert("Error saving skill to backend: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTeachSkill = async (id) => {
    try {
      if (currentUser?.id) {
        await skillsService.deleteSkill(id, currentUser.id).catch(() => {});
      }
    } catch (err) {
      console.warn("Backend delete warning:", err);
    }
    const updated = teachSkills.filter((s) => s.id !== id);
    setTeachSkills(updated);
    localStorage.setItem("teachSkills", JSON.stringify(updated));
  };

  const deleteLearnSkill = async (id) => {
    try {
      if (currentUser?.id) {
        await skillsService.deleteSkill(id, currentUser.id).catch(() => {});
      }
    } catch (err) {
      console.warn("Backend delete warning:", err);
    }
    const updated = learnSkills.filter((s) => s.id !== id);
    setLearnSkills(updated);
    localStorage.setItem("learnSkills", JSON.stringify(updated));
  };

  return (
    <main className="my-skills-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="my-skills-header">

        <p className="section-label">
          MY SKILLS
        </p>

        <h1>
          What can you
          <span> exchange?</span>
        </h1>

        <p>
          Add the skills you can teach and the skills
          you want to learn. This helps SkillSwap find
          better matches for you.
        </p>

      </section>


      {/* =========================
          SKILLS GRID
      ========================= */}

      <div className="skills-management-grid">

        {/* =========================
            CAN TEACH
        ========================= */}

        <section className="skill-management-card">

          <div className="management-card-header">

            <div className="management-icon teach-icon">
              💡
            </div>

            <div>
              <h2>
                Skills I can teach
              </h2>

              <p>
                Share your knowledge with others.
              </p>
            </div>

          </div>


          {/* ADD FORM */}

          <form
            className="skill-add-form"
            onSubmit={addTeachSkill}
          >

            <div className="form-group">

              <label>
                Skill name
              </label>

              <input
                type="text"
                value={teachName}
                onChange={(e) =>
                  setTeachName(e.target.value)
                }
                placeholder="e.g. React Development"
              />

            </div>


            <div className="skill-form-row">

              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  value={teachCategory}
                  onChange={(e) =>
                    setTeachCategory(e.target.value)
                  }
                >
                  <option>
                    Technology
                  </option>

                  <option>
                    Design
                  </option>

                  <option>
                    Creative
                  </option>

                  <option>
                    Business
                  </option>

                  <option>
                    Languages
                  </option>
                </select>

              </div>


              <div className="form-group">

                <label>
                  Level
                </label>

                <select
                  value={teachLevel}
                  onChange={(e) =>
                    setTeachLevel(e.target.value)
                  }
                >
                  <option>
                    Beginner
                  </option>

                  <option>
                    Intermediate
                  </option>

                  <option>
                    Advanced
                  </option>
                </select>

              </div>

            </div>


            <button
              type="submit"
              className="add-skill-button"
              disabled={loading}
            >
              {loading ? "Adding..." : "+ Add skill"}
            </button>

          </form>


          {/* SKILL LIST */}

          <div className="my-skill-list">

            {teachSkills.length === 0 ? (

              <div className="empty-skills">

                <span>
                  💡
                </span>

                <p>
                  You haven't added any teaching
                  skills yet.
                </p>

              </div>

            ) : (

              teachSkills.map((skill) => (

                <div
                  className="my-skill-item"
                  key={skill.id}
                >

                  <div>

                    <strong>
                      {skill.name}
                    </strong>

                    <small>
                      {skill.category} · {skill.level}
                    </small>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      deleteTeachSkill(skill.id)
                    }
                    aria-label="Delete skill"
                  >
                    ×
                  </button>

                </div>

              ))

            )}

          </div>

        </section>


        {/* =========================
            WANT TO LEARN
        ========================= */}

        <section className="skill-management-card">

          <div className="management-card-header">

            <div className="management-icon learn-icon">
              🎯
            </div>

            <div>
              <h2>
                Skills I want to learn
              </h2>

              <p>
                Tell people what you want to learn.
              </p>
            </div>

          </div>


          {/* ADD FORM */}

          <form
            className="skill-add-form"
            onSubmit={addLearnSkill}
          >

            <div className="form-group">

              <label>
                Skill name
              </label>

              <input
                type="text"
                value={learnName}
                onChange={(e) =>
                  setLearnName(e.target.value)
                }
                placeholder="e.g. UI/UX Design"
              />

            </div>


            <div className="skill-form-row">

              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  value={learnCategory}
                  onChange={(e) =>
                    setLearnCategory(e.target.value)
                  }
                >
                  <option>
                    Technology
                  </option>

                  <option>
                    Design
                  </option>

                  <option>
                    Creative
                  </option>

                  <option>
                    Business
                  </option>

                  <option>
                    Languages
                  </option>
                </select>

              </div>


              <div className="form-group">

                <label>
                  Level
                </label>

                <select
                  value={learnLevel}
                  onChange={(e) =>
                    setLearnLevel(e.target.value)
                  }
                >
                  <option>
                    Beginner
                  </option>

                  <option>
                    Intermediate
                  </option>

                  <option>
                    Advanced
                  </option>

                </select>

              </div>

            </div>


            <button
              type="submit"
              className="add-skill-button"
              disabled={loading}
            >
              {loading ? "Adding..." : "+ Add skill"}
            </button>

          </form>


          {/* SKILL LIST */}

          <div className="my-skill-list">

            {learnSkills.length === 0 ? (

              <div className="empty-skills">

                <span>
                  🎯
                </span>

                <p>
                  You haven't added any learning
                  goals yet.
                </p>

              </div>

            ) : (

              learnSkills.map((skill) => (

                <div
                  className="my-skill-item"
                  key={skill.id}
                >

                  <div>

                    <strong>
                      {skill.name}
                    </strong>

                    <small>
                      {skill.category} · {skill.level}
                    </small>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      deleteLearnSkill(skill.id)
                    }
                    aria-label="Delete skill"
                  >
                    ×
                  </button>

                </div>

              ))

            )}

          </div>

        </section>

      </div>

    </main>
  );
}

export default MySkills;
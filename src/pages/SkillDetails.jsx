import { Link, useParams } from "react-router-dom";
import { useCallback } from "react";
import "./SkillDetails.css";
import { requestsService, authService } from "../services/api";
function SkillDetails() {
  const { id } = useParams();

  const skills = {
    1: {
      name: "React Development",
      person: "Arjun Kumar",
      level: "Intermediate",
      category: "Programming",
      teaches: "React",
      wants: "UI/UX Design",
      about:
        "I enjoy building modern web applications with React and helping beginners understand frontend development.",
    },

    2: {
      name: "Graphic Design",
      person: "Priya Sharma",
      level: "Advanced",
      category: "Design",
      teaches: "Graphic Design",
      wants: "Photography",
      about:
        "I create digital designs, posters and social media graphics and enjoy sharing my design knowledge.",
    },

    3: {
      name: "Python Programming",
      person: "Rahul Verma",
      level: "Intermediate",
      category: "Programming",
      teaches: "Python",
      wants: "Web Development",
      about:
        "I work with Python and enjoy teaching programming concepts through simple practical examples.",
    },

    4: {
      name: "Photography",
      person: "Sneha Reddy",
      level: "Beginner",
      category: "Creative",
      teaches: "Photography",
      wants: "Video Editing",
      about:
        "I enjoy photography and would love to exchange photography knowledge with someone interested in creative skills.",
    },

    5: {
      name: "UI/UX Design",
      person: "Kiran Patel",
      level: "Advanced",
      category: "Design",
      teaches: "UI/UX Design",
      wants: "React",
      about:
        "I design user-friendly interfaces and enjoy discussing design systems, wireframes and user experience.",
    },

    6: {
      name: "Digital Marketing",
      person: "Ananya Rao",
      level: "Intermediate",
      category: "Business",
      teaches: "Digital Marketing",
      wants: "Python",
      about:
        "I am interested in digital marketing, content strategy and helping others understand online growth.",
    },
  };

  const skill = skills[id] || skills[1];

  const handleRequest = useCallback(async () => {
    const currentUser = authService.getCurrentUser() || { name: "User", email: "" };

    const savedRequests =
      localStorage.getItem("skillswapRequests");

    const requests = savedRequests
      ? JSON.parse(savedRequests)
      : [];

    const alreadySent = requests.some(
      (request) =>
        request.skillId === id &&
        request.from === currentUser.name
    );

    if (alreadySent) {
      alert("You have already sent a request to this person.");
      return;
    }

    try {
      if (currentUser?.id) {
        await requestsService.createRequest({
          fromUserId: currentUser.id,
          toUserId: Number(id) || 2,
          skillName: skill.name,
          message: `Hi ${skill.person}, I would like to learn ${skill.name} from you.`,
        });
      }
    } catch (err) {
      console.warn("Backend request note:", err);
    }

    const newRequest = {
      id: Date.now(),
      skillId: id,
      person: skill.person,
      skill: skill.teaches,
      category: skill.category,
      level: skill.level,
      from: currentUser.name,
      status: "Pending",
      date: new Date().toLocaleDateString(),
    };

    requests.push(newRequest);

    localStorage.setItem(
      "skillswapRequests",
      JSON.stringify(requests)
    );

    alert(
      `Your skill swap request was sent to ${skill.person}!`
    );
  }, [id, skill]);

  return (
    <div className="skill-details-page">

      <Link
        to="/find-skills"
        className="back-link"
      >
        ← Back to Find Skills
      </Link>


      <div className="skill-details-container">

        {/* PROFILE HEADER */}

        <div className="skill-profile-card">

          <div className="large-avatar">
            {skill.person.charAt(0)}
          </div>

          <div className="profile-main-info">

            <span className="category-tag">
              {skill.category}
            </span>

            <h1>
              {skill.person}
            </h1>

            <p className="profile-level">
              {skill.level} • SkillSwap member
            </p>

          </div>

        </div>


        {/* DETAILS */}

        <div className="skill-details-grid">

          <div className="skill-about-card">

            <p className="section-label">
              ABOUT THIS MEMBER
            </p>

            <h2>
              {skill.person} wants to share knowledge.
            </h2>

            <p className="about-text">
              {skill.about}
            </p>


            <div className="skill-exchange">

              <div className="exchange-box">

                <span>
                  TEACHES
                </span>

                <strong>
                  {skill.teaches}
                </strong>

              </div>


              <div className="exchange-arrow">
                ⇄
              </div>


              <div className="exchange-box">

                <span>
                  WANTS TO LEARN
                </span>

                <strong>
                  {skill.wants}
                </strong>

              </div>

            </div>

          </div>


          {/* REQUEST */}

          <div className="swap-request-card">

            <h2>
              Interested in learning?
            </h2>

            <p>
              Send {skill.person} a skill swap request
              and start learning together.
            </p>

            <button
              className="swap-request-button"
              onClick={handleRequest}
            >
              Send Swap Request
            </button>

            <small>
              Your request will appear in your Requests
              page.
            </small>

          </div>

        </div>

      </div>

    </div>
  );
}

export default SkillDetails;
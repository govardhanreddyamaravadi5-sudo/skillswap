
import React, { useState, useEffect } from "react";
import "./Sessions.css";
import { sessionsService, authService } from "../services/api";

function Sessions() {
  const currentUser = authService.getCurrentUser();

  // Read the session details passed from Messages.
  const getSavedSession = () => {
    try {
      return JSON.parse(
        sessionStorage.getItem("skillswapNewSession") || "null"
      );
    } catch {
      return null;
    }
  };

  const [showScheduleForm, setShowScheduleForm] = useState(
    new URLSearchParams(window.location.search).get("schedule") === "true"
  );

  const [selectedSession, setSelectedSession] = useState(null);

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("skillswapSessions");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: "React Basics",
            person: "Rahul Kumar",
            date: "October 12, 2026",
            time: "10:00 AM",
            type: "Learning",
            status: "Upcoming",
            meetLink: "https://meet.google.com/skillswap-react",
          },
          {
            id: 2,
            title: "UI/UX Design",
            person: "Anjali Sharma",
            date: "October 15, 2026",
            time: "5:30 PM",
            type: "Teaching",
            status: "Upcoming",
            meetLink: "https://meet.google.com/skillswap-design",
          },
        ];
  });

  useEffect(() => {
    if (currentUser?.id) {
      sessionsService.getUserSessions(currentUser.id).then((serverSessions) => {
        if (serverSessions && Array.isArray(serverSessions) && serverSessions.length > 0) {
          setSessions(serverSessions);
          localStorage.setItem("skillswapSessions", JSON.stringify(serverSessions));
        }
      }).catch(console.warn);
    }
  }, [currentUser?.id]);

  const [formData, setFormData] = useState(() => {
    const savedSession = getSavedSession();
    return {
      title: savedSession?.skill || "",
      person: savedSession?.person || "",
      partnerEmail: "",
      date: "",
      time: "",
      type: "Learning",
      meetLink: "",
    };
  });

  const [copiedId, setCopiedId] = useState(null);

  const copyMeetLink = (session) => {
    const link = session?.meetLink || "https://meet.google.com/new";
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(session.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Update form inputs.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Open a fresh scheduling form.
  const openScheduleForm = () => {
    setFormData({
      title: "",
      person: "",
      partnerEmail: "",
      date: "",
      time: "",
      type: "Learning",
      meetLink: "",
    });
    sessionStorage.removeItem("skillswapNewSession");
    setShowScheduleForm(true);
  };

  // Schedule a session and open Google Calendar with Meet conferencing.
  const handleSchedule = async (event) => {
    event.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.person.trim() ||
      !formData.date ||
      !formData.time
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const selectedDate = new Date(`${formData.date}T00:00:00`);
    const formattedDate = selectedDate.toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });

    const [hours, minutes] = formData.time.split(":").map(Number);
    const formattedTime = new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit",
    });

    // Build a Google Calendar event-creation URL with conferencing pre-enabled.
    // This opens Calendar in a new tab so the user can save the event and get a real Meet link.
    const startDt = new Date(`${formData.date}T${formData.time}:00`);
    const endDt   = new Date(startDt.getTime() + 60 * 60 * 1000); // +1 hour
    const pad = (n) => String(n).padStart(2, "0");
    const toCalFmt = (d) =>
      `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}` +
      `T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const calUrl =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent("SkillSwap: " + formData.title.trim())}` +
      `&dates=${toCalFmt(startDt)}/${toCalFmt(endDt)}` +
      `&details=${encodeURIComponent("SkillSwap session with " + formData.person.trim() + ".\n\nJoin via Google Meet (link below).")}` +
      "&crm=CONFERENCING"; // auto-adds a Google Meet link

    // Open Google Calendar in a new tab — Meet link is generated when user saves the event.
    window.open(calUrl, "_blank", "noopener,noreferrer");

    // Use the pasted Meet link or fallback to meet.google.com/new
    const meetLink = formData.meetLink.trim() || "https://meet.google.com/new";

    const newSession = {
      title: formData.title.trim(),
      organizerId: currentUser?.id || 1,
      person: formData.person.trim(),
      partnerEmail: formData.partnerEmail.trim() || null,
      date: formattedDate,
      time: formattedTime,
      type: formData.type,
      status: "Upcoming",
      meetLink,
    };

    try {
      if (currentUser?.id) {
        const saved = await sessionsService.createSession(newSession);
        setSessions((previous) => [saved, ...previous]);
        localStorage.setItem("skillswapSessions", JSON.stringify([saved, ...sessions]));
      } else {
        const localSession = { ...newSession, id: Date.now() };
        setSessions((previous) => [localSession, ...previous]);
        localStorage.setItem("skillswapSessions", JSON.stringify([localSession, ...sessions]));
      }
    } catch (err) {
      console.warn("Backend error scheduling session:", err);
      const localSession = { ...newSession, id: Date.now() };
      setSessions((previous) => [localSession, ...previous]);
    }

    setFormData({ title: "", person: "", partnerEmail: "", date: "", time: "", type: "Learning", meetLink: "" });
    sessionStorage.removeItem("skillswapNewSession");
    window.history.replaceState({}, "", "/sessions");
    setShowScheduleForm(false);
    alert("Session scheduled! Share the Meet link with the other person via Messages so they can join.");
  };

  // Cancel a session.
  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this session?"
    );

    if (!confirmed) return;

    try {
      await sessionsService.deleteSession(id);
    } catch (err) {
      console.warn("Backend cancel error:", err);
    }

    const updated = sessions.filter((session) => session.id !== id);
    setSessions(updated);
    localStorage.setItem("skillswapSessions", JSON.stringify(updated));

    setSelectedSession(null);
    alert("Session cancelled.");
  };

  // Open the session's real Google Meet link in a new tab.
  const handleJoinMeet = (session) => {
    const url = session?.meetLink || "https://meet.google.com/new";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const upcomingSessions = sessions.filter(
    (session) => session.status === "Upcoming"
  );

  const completedSessions = sessions.filter(
    (session) => session.status === "Completed"
  );

  return (
    <main className="sessions-page">
      <div className="sessions-container">
        {/* PAGE HEADER */}
        <header className="sessions-header">
          <div>
            <p className="sessions-eyebrow">
              LEARN • TEACH • CONNECT
            </p>

            <h1>My Sessions</h1>

            <p>
              Manage your upcoming and completed SkillSwap sessions.
            </p>
          </div>

          <button
            type="button"
            className="schedule-session-button"
            onClick={openScheduleForm}
          >
            + Schedule Session
          </button>
        </header>

        {/* UPCOMING SESSIONS */}
        <section className="sessions-section">
          <div className="section-title-row">
            <div>
              <h2>Upcoming Sessions</h2>
              <p>Your scheduled learning and teaching sessions.</p>
            </div>

            <span className="session-count">
              {upcomingSessions.length}
            </span>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className="empty-sessions">
              <div className="empty-icon">📅</div>
              <h3>No upcoming sessions</h3>
              <p>Schedule a session to start learning or teaching.</p>
            </div>
          ) : (
            <div className="session-grid">
              {upcomingSessions.map((session) => (
                <article className="session-card" key={session.id}>
                  <div className="session-card-top">
                    <div className="session-icon">⇄</div>
                    <span className="status-badge upcoming">
                      Upcoming
                    </span>
                  </div>

                  <h3>{session.title}</h3>
                  <p className="session-person">
                    With {session.person}
                  </p>

                  <div className="session-info">
                    <div>
                      <span>📅</span>
                      {session.date}
                    </div>
                    <div>
                      <span>🕐</span>
                      {session.time}
                    </div>
                    <div>
                      <span>🎓</span>
                      {session.type}
                    </div>
                  </div>

                  <div className="session-actions">
                    <button
                      type="button"
                      className="details-button"
                      onClick={() => setSelectedSession(session)}
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      className="meet-button"
                      onClick={() => handleJoinMeet(session)}
                    >
                      Join Google Meet
                    </button>

                    <button
                      type="button"
                      className="copy-link-button"
                      onClick={() => copyMeetLink(session)}
                      title="Copy Meet link to share with the other person"
                    >
                      {copiedId === session.id ? "✓ Copied!" : "📋 Copy Meet Link"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* COMPLETED SESSIONS */}
        <section className="sessions-section completed-section">
          <div className="section-title-row">
            <div>
              <h2>Completed Sessions</h2>
              <p>Sessions you have already completed.</p>
            </div>

            <span className="session-count completed-count">
              {completedSessions.length}
            </span>
          </div>

          {completedSessions.length === 0 ? (
            <div className="empty-sessions">
              <div className="empty-icon">✓</div>
              <h3>No completed sessions</h3>
              <p>Your completed sessions will appear here.</p>
            </div>
          ) : (
            <div className="session-grid">
              {completedSessions.map((session) => (
                <article
                  className="session-card completed"
                  key={session.id}
                >
                  <div className="session-card-top">
                    <div className="session-icon">✓</div>
                    <span className="status-badge completed-badge">
                      Completed
                    </span>
                  </div>

                  <h3>{session.title}</h3>
                  <p className="session-person">
                    With {session.person}
                  </p>

                  <div className="session-info">
                    <div>
                      <span>📅</span>
                      {session.date}
                    </div>
                    <div>
                      <span>🕐</span>
                      {session.time}
                    </div>
                    <div>
                      <span>🎓</span>
                      {session.type}
                    </div>
                  </div>

                  <div className="session-actions">
                    <button
                      type="button"
                      className="details-button"
                      onClick={() => setSelectedSession(session)}
                    >
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* SCHEDULE SESSION MODAL */}
      {showScheduleForm && (
        <div
          className="session-modal-overlay"
          onClick={() => setShowScheduleForm(false)}
        >
          <div
            className="session-modal schedule-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="session-modal-close"
              aria-label="Close schedule form"
              onClick={() => setShowScheduleForm(false)}
            >
              ×
            </button>

            <p className="sessions-eyebrow">NEW SESSION</p>
            <h2>Schedule a Session</h2>

            <p className="modal-subtitle">
              Choose a person, date and time for your SkillSwap session.
            </p>

            <form onSubmit={handleSchedule}>
              <label htmlFor="session-title">
                Skill / Session Title
              </label>
              <input
                id="session-title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: React Basics"
                required
              />

              <label htmlFor="session-person">Person</label>
              <input
                id="session-person"
                type="text"
                name="person"
                value={formData.person}
                onChange={handleChange}
                placeholder="Enter person's name"
                required
              />

              <label htmlFor="session-partner-email">
                Partner's Email
                <span className="field-hint"> (so the session appears in their schedule)</span>
              </label>
              <input
                id="session-partner-email"
                type="email"
                name="partnerEmail"
                value={formData.partnerEmail}
                onChange={handleChange}
                placeholder="partner@example.com"
              />

              <div className="form-row">
                <div>
                  <label htmlFor="session-date">Date</label>
                  <input
                    id="session-date"
                    type="date"
                    name="date"
                    value={formData.date}
                    min={new Date().toLocaleDateString("en-CA")}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="session-time">Time</label>
                  <input
                    id="session-time"
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <label htmlFor="session-type">Session Type</label>
              <select
                id="session-type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Learning">Learning</option>
                <option value="Teaching">Teaching</option>
              </select>

              <div className="meet-link-section">
                <label htmlFor="session-meetlink">
                  Google Meet Link
                  <span className="field-hint"> (optional)</span>
                </label>
                <div className="meet-link-row">
                  <input
                    id="session-meetlink"
                    type="url"
                    name="meetLink"
                    value={formData.meetLink}
                    onChange={handleChange}
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  />
                  <button
                    type="button"
                    className="open-calendar-button"
                    onClick={() => {
                      if (!formData.date || !formData.time) {
                        alert("Please fill in date and time first.");
                        return;
                      }
                      const startDt = new Date(`${formData.date}T${formData.time}:00`);
                      const endDt = new Date(startDt.getTime() + 60 * 60 * 1000);
                      const pad = (n) => String(n).padStart(2, "0");
                      const toCalFmt = (d) =>
                        `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}` +
                        `T${pad(d.getHours())}${pad(d.getMinutes())}00`;
                      const calUrl =
                        "https://calendar.google.com/calendar/render?action=TEMPLATE" +
                        `&text=${encodeURIComponent("SkillSwap: " + (formData.title || "Session"))}` +
                        `&dates=${toCalFmt(startDt)}/${toCalFmt(endDt)}` +
                        `&details=${encodeURIComponent("SkillSwap session with " + (formData.person || "") + ".")}` +
                        "&crm=CONFERENCING";
                      window.open(calUrl, "_blank", "noopener,noreferrer");
                    }}
                    title="Opens Google Calendar with Meet conferencing — copy the Meet link from there and paste it above"
                  >
                    📅 Open in Calendar
                  </button>
                </div>
                <p className="meet-link-hint">
                  Click "Open in Calendar", save the event, then copy the Meet link Google generates and paste it above.
                  Both you and the other person will use this same link to join.
                </p>
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="modal-close-button"
                  onClick={() => setShowScheduleForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-meet-button"
                >
                  Schedule &amp; Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SESSION DETAILS MODAL */}
      {selectedSession && (
        <div
          className="session-modal-overlay"
          onClick={() => setSelectedSession(null)}
        >
          <div
            className="session-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="session-modal-close"
              aria-label="Close session details"
              onClick={() => setSelectedSession(null)}
            >
              ×
            </button>

            <p className="sessions-eyebrow">SESSION DETAILS</p>
            <h2>{selectedSession.title}</h2>

            <div className="session-modal-info">
              <div>
                <strong>👤 Person</strong>
                <span>{selectedSession.person}</span>
              </div>
              <div>
                <strong>📅 Date</strong>
                <span>{selectedSession.date}</span>
              </div>
              <div>
                <strong>🕐 Time</strong>
                <span>{selectedSession.time}</span>
              </div>
              <div>
                <strong>🎓 Type</strong>
                <span>{selectedSession.type}</span>
              </div>
              <div>
                <strong>📌 Status</strong>
                <span>{selectedSession.status}</span>
              </div>
            </div>

            {selectedSession.meetLink && (
              <div className="meet-link-display">
                <strong>📹 Meet Link:</strong>
                <span className="meet-link-text">{selectedSession.meetLink}</span>
                <button
                  type="button"
                  className="copy-link-button"
                  onClick={() => copyMeetLink(selectedSession)}
                >
                  {copiedId === selectedSession.id ? "✓ Copied!" : "📋 Copy to share"}
                </button>
              </div>
            )}

            {selectedSession.status === "Upcoming" && (
              <div className="modal-action-group">
                <button
                  type="button"
                  className="modal-meet-button"
                  onClick={() => handleJoinMeet(selectedSession)}
                >
                  Join Google Meet
                </button>

                <button
                  type="button"
                  className="modal-reschedule-button"
                  onClick={() =>
                    alert(
                      "The rescheduling form will be implemented next."
                    )
                  }
                >
                  Reschedule Session
                </button>

                <button
                  type="button"
                  className="modal-cancel-session"
                  onClick={() => handleCancel(selectedSession.id)}
                >
                  Cancel Session
                </button>
              </div>
            )}

            <button
              type="button"
              className="modal-close-button full-width"
              onClick={() => setSelectedSession(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Sessions;

import { useState, useEffect } from "react";
import "./Requests.css";
import { requestsService, authService } from "../services/api";

function Requests() {
  const currentUser = authService.getCurrentUser();

  const [incomingRequests, setIncomingRequests] = useState(() => {
    const saved = localStorage.getItem("incomingRequests");
    return saved ? JSON.parse(saved) : [];
  });

  const [sentRequests, setSentRequests] = useState(() => {
    const saved = localStorage.getItem("sentRequests");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (currentUser?.id) {
      // Load incoming
      requestsService.getIncoming(currentUser.id).then((incoming) => {
        if (incoming && Array.isArray(incoming)) {
          const mapped = incoming.map((req) => ({
            id: req.id,
            name: req.fromUserName || "Community Member",
            skill: req.skillName,
            message: req.message,
            date: req.date || "Today",
            status: req.status,
          }));
          setIncomingRequests(mapped);
          localStorage.setItem("incomingRequests", JSON.stringify(mapped));
        }
      }).catch(console.warn);

      // Load sent
      requestsService.getSent(currentUser.id).then((sent) => {
        if (sent && Array.isArray(sent)) {
          const mapped = sent.map((req) => ({
            id: req.id,
            name: req.toUserName || "Community Member",
            skill: req.skillName,
            message: req.message,
            date: req.date || "Today",
            status: req.status,
          }));
          setSentRequests(mapped);
          localStorage.setItem("sentRequests", JSON.stringify(mapped));
        }
      }).catch(console.warn);
    }
  }, [currentUser?.id]);

  const updateRequest = async (id, status) => {
    try {
      await requestsService.updateStatus(id, status);
    } catch (err) {
      console.warn("Backend update error:", err);
    }

    const updatedRequests = incomingRequests.map((request) =>
      request.id === id ? { ...request, status } : request
    );

    setIncomingRequests(updatedRequests);
    localStorage.setItem("incomingRequests", JSON.stringify(updatedRequests));
  };

  return (
    <main className="requests-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="requests-header">

        <p className="section-label">
          SWAP REQUESTS
        </p>

        <h1>
          Manage your
          <span> connections.</span>
        </h1>

        <p>
          See who wants to exchange skills with you
          and keep track of the requests you have sent.
        </p>

      </section>


      {/* =========================
          INCOMING REQUESTS
      ========================= */}

      <section className="requests-section">

        <div className="requests-section-header">

          <div>
            <h2>
              Incoming requests
            </h2>

            <p>
              People who want to learn from you.
            </p>
          </div>

          <span className="request-count">
            {
              incomingRequests.filter(
                (request) =>
                  request.status === "Pending"
              ).length
            } pending
          </span>

        </div>


        <div className="request-list">

          {incomingRequests.length === 0 ? (

            <div className="empty-requests">

              <div className="empty-request-icon">
                📭
              </div>

              <h3>
                No incoming requests
              </h3>

              <p>
                New skill exchange requests will
                appear here.
              </p>

            </div>

          ) : (

            incomingRequests.map((request) => (

              <div
                className="request-card"
                key={request.id}
              >

                {/* USER */}

                <div className="request-user">

                  <div className="request-avatar">
                    {request.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <h3>
                      {request.name}
                    </h3>

                    <span>
                      {request.date}
                    </span>

                  </div>

                </div>


                {/* REQUEST DETAILS */}

                <div className="request-details">

                  <p className="request-label">
                    Wants to learn
                  </p>

                  <strong>
                    {request.skill}
                  </strong>

                  <p className="request-message">
                    "{request.message}"
                  </p>

                </div>


                {/* ACTIONS */}

                <div className="request-actions">

                  {request.status === "Pending" ? (

                    <>
                      <button
                        type="button"
                        className="decline-button"
                        onClick={() =>
                          updateRequest(
                            request.id,
                            "Declined"
                          )
                        }
                      >
                        Decline
                      </button>

                      <button
                        type="button"
                        className="accept-button"
                        onClick={() =>
                          updateRequest(
                            request.id,
                            "Accepted"
                          )
                        }
                      >
                        Accept
                      </button>
                    </>

                  ) : (

                    <span
                      className={
                        request.status ===
                        "Accepted"
                          ? "request-status accepted"
                          : "request-status declined"
                      }
                    >
                      {request.status}
                    </span>

                  )}

                </div>

              </div>

            ))

          )}

        </div>

      </section>


      {/* =========================
          SENT REQUESTS
      ========================= */}

      <section className="requests-section sent-section">

        <div className="requests-section-header">

          <div>

            <h2>
              Sent requests
            </h2>

            <p>
              Requests you have sent to other people.
            </p>

          </div>

        </div>


        <div className="request-list">

          {sentRequests.length === 0 ? (

            <div className="empty-requests">

              <div className="empty-request-icon">
                📤
              </div>

              <h3>
                No sent requests
              </h3>

              <p>
                When you request a skill swap,
                it will appear here.
              </p>

            </div>

          ) : (

            sentRequests.map((request) => (

              <div
                className="request-card sent-request-card"
                key={request.id}
              >

                <div className="request-user">

                  <div className="request-avatar">
                    {request.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <h3>
                      {request.name}
                    </h3>

                    <span>
                      {request.date}
                    </span>

                  </div>

                </div>


                <div className="request-details">

                  <p className="request-label">
                    Skill you want to learn
                  </p>

                  <strong>
                    {request.skill}
                  </strong>

                  <p className="request-message">
                    "{request.message}"
                  </p>

                </div>


                <div>

                  <span className="request-status pending">
                    {request.status}
                  </span>

                </div>

              </div>

            ))

          )}

        </div>

      </section>

    </main>
  );
}

export default Requests;
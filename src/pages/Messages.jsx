import React, { useState, useEffect } from "react";
import "./Messages.css";
import { messagesService, authService } from "../services/api";

function Messages() {
  const currentUser = authService.getCurrentUser() || { id: 1, name: "You" };

  const [conversations] = useState([
    {
      id: 2,
      name: "Arjun Kumar",
      skill: "React",
      lastMessage: "Looking forward to our session!",
      time: "10:30 AM",
      online: true,
    },
    {
      id: 3,
      name: "Priya Sharma",
      skill: "Graphic Design",
      lastMessage: "I'll send you the design resources.",
      time: "Yesterday",
      online: true,
    },
    {
      id: 4,
      name: "Rahul Verma",
      skill: "Python",
      lastMessage: "Thank you for the mentorship!",
      time: "Monday",
      online: false,
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(2);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      senderId: 2,
      senderName: "Arjun Kumar",
      content: "Hey! I saw that you're interested in skill exchange.",
      time: "10:25 AM",
    },
    {
      id: 2,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: "Yes! I'd love to learn from you.",
      time: "10:27 AM",
    },
    {
      id: 3,
      senderId: 2,
      senderName: "Arjun Kumar",
      content: "Sure! Let's schedule a session and learn together.",
      time: "10:30 AM",
    },
  ]);

  // Fetch chat history from backend when conversation changes
  useEffect(() => {
    if (currentUser?.id && selectedUser) {
      messagesService.getChatHistory(currentUser.id, selectedUser).then((history) => {
        if (history && Array.isArray(history) && history.length > 0) {
          setChatMessages(history);
        }
      }).catch(console.warn);
    }
  }, [selectedUser, currentUser?.id]);

  const selectedConversation = conversations.find(
    (user) => user.id === selectedUser
  ) || conversations[0];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMsg = {
      id: Date.now(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId: selectedConversation.id,
      content: message.trim(),
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setMessage("");

    try {
      if (currentUser?.id) {
        await messagesService.sendMessage({
          senderId: currentUser.id,
          receiverId: selectedConversation.id,
          content: newMsg.content,
        });
      }
    } catch (err) {
      console.warn("Backend error sending message:", err);
    }
  };

  return (
    <main className="messages-page">
      <div className="messages-container">

        {/* Page Header */}
        <div className="messages-header">
          <div>
            <p className="messages-eyebrow">STAY CONNECTED</p>
            <h1>Messages</h1>
            <p>Chat with people you've connected with on SkillSwap.</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="messages-box">

          {/* Conversations */}
          <aside className="conversation-sidebar">
            <div className="conversation-title">
              <h2>Conversations</h2>
            </div>

            <div className="conversation-list">
              {conversations.map((user) => (
                <button
                  key={user.id}
                  className={`conversation-item ${
                    selectedUser === user.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedUser(user.id)}
                >
                  <div className="conversation-avatar">
                    {user.name.charAt(0)}
                  </div>

                  <div className="conversation-info">
                    <div className="conversation-top">
                      <h3>{user.name}</h3>
                      <span>{user.time}</span>
                    </div>

                    <p>{user.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Chat */}
          <section className="chat-area">

            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-user-avatar">
                {selectedConversation.name.charAt(0)}
              </div>

              <div className="chat-user-info">
                <h2>{selectedConversation.name}</h2>
                <p>
                  <span
                    className={
                      selectedConversation.online
                        ? "status-online"
                        : "status-offline"
                    }
                  >
                    ●
                  </span>{" "}
                  {selectedConversation.online ? "Online" : "Offline"}
                </p>
              </div>

              <button
                type="button"
                className="chat-schedule-button"
                onClick={() => {
                  const person = selectedConversation.name;
                  const skill = selectedConversation.skill;

                  sessionStorage.setItem(
                    "skillswapNewSession",
                    JSON.stringify({ person, skill })
                  );

                  window.location.href = "/sessions?schedule=true";
                }}
              >
                + Schedule Session
              </button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              <div className="message-date">
                Today
              </div>

              {chatMessages.map((msg) => {
                const isSent = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`message ${isSent ? "sent" : "received"}`}
                  >
                    {!isSent && (
                      <div className="message-avatar">
                        {selectedConversation.name.charAt(0)}
                      </div>
                    )}
                    <div className="message-content">
                      <p>{msg.content}</p>
                      <span>{msg.time || "Just now"}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message Input */}
            <form className="message-input-area" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button type="submit">
                Send
              </button>
            </form>

          </section>
        </div>
      </div>
    </main>
  );
}

export default Messages;
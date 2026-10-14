const API_BASE_URL = "http://localhost:8081/api";

export const authService = {
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("skillswapUser");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem("skillswapUser", JSON.stringify(user));
      localStorage.setItem("skillswapLoggedIn", "true");
    } else {
      localStorage.removeItem("skillswapUser");
      localStorage.removeItem("skillswapLoggedIn");
    }
    window.dispatchEvent(new Event("storage"));
  },

  async register(name, email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return data;
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Invalid credentials");
    }
    this.setCurrentUser(data);
    return data;
  },

  async googleLogin(googleUser) {
    const res = await fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(googleUser),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Google authentication failed");
    }
    this.setCurrentUser(data);
    return data;
  },

  logout() {
    this.setCurrentUser(null);
  },
};

export const skillsService = {
  async getUserSkills(userId, type = "") {
    try {
      const url = type
        ? `${API_BASE_URL}/skills/user/${userId}?type=${type}`
        : `${API_BASE_URL}/skills/user/${userId}`;
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn("Could not fetch user skills from backend, falling back to local cache", err);
    }
    return null;
  },

  async addSkill(userId, skillData) {
    const res = await fetch(`${API_BASE_URL}/skills?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skillData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add skill");
    return data;
  },

  async deleteSkill(skillId, userId) {
    const res = await fetch(`${API_BASE_URL}/skills/${skillId}?userId=${userId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Failed to delete skill");
    }
    return true;
  },

  async exploreSkills(search = "", category = "All", level = "All", excludeUserId = null) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category && category !== "All") params.append("category", category);
    if (level && level !== "All") params.append("level", level);
    if (excludeUserId) params.append("excludeUserId", excludeUserId);

    const res = await fetch(`${API_BASE_URL}/skills/explore?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to load skills");
    return await res.json();
  },

  async getSkillById(id) {
    const res = await fetch(`${API_BASE_URL}/skills/${id}`);
    if (!res.ok) throw new Error("Skill not found");
    return await res.json();
  },
};

export const requestsService = {
  async createRequest(requestData) {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send request");
    return data;
  },

  async getIncoming(userId) {
    const res = await fetch(`${API_BASE_URL}/requests/incoming/${userId}`);
    if (!res.ok) throw new Error("Failed to load incoming requests");
    return await res.json();
  },

  async getSent(userId) {
    const res = await fetch(`${API_BASE_URL}/requests/sent/${userId}`);
    if (!res.ok) throw new Error("Failed to load sent requests");
    return await res.json();
  },

  async updateStatus(requestId, status) {
    const res = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update request status");
    return data;
  },
};

export const sessionsService = {
  async getUserSessions(userId) {
    const res = await fetch(`${API_BASE_URL}/sessions/user/${userId}`);
    if (!res.ok) throw new Error("Failed to load sessions");
    return await res.json();
  },

  async createSession(sessionData) {
    const res = await fetch(`${API_BASE_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to schedule session");
    return data;
  },

  async updateSession(id, sessionData) {
    const res = await fetch(`${API_BASE_URL}/sessions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sessionData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update session");
    return data;
  },

  async deleteSession(id) {
    const res = await fetch(`${API_BASE_URL}/sessions/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to cancel session");
    return true;
  },
};

export const messagesService = {
  async getChatHistory(user1, user2) {
    const res = await fetch(`${API_BASE_URL}/messages/history?user1=${user1}&user2=${user2}`);
    if (!res.ok) throw new Error("Failed to load messages");
    return await res.json();
  },

  async sendMessage(messageData) {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messageData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send message");
    return data;
  },
};

export const usersService = {
  async getProfile(userId) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (!res.ok) throw new Error("Failed to load profile");
    return await res.json();
  },

  async getProfileByEmail(email) {
    const res = await fetch(`${API_BASE_URL}/users/profile?email=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error("Failed to load profile");
    return await res.json();
  },

  async updateProfile(userId, profileData) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update profile");
    return data;
  },

  async getCommunity(excludeUserId = null) {
    const url = excludeUserId
      ? `${API_BASE_URL}/users/community?excludeUserId=${excludeUserId}`
      : `${API_BASE_URL}/users/community`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to load community");
    return await res.json();
  },
};

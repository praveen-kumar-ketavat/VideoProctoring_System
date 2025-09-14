const API_URL = "http://localhost:5000/api"; // backend base URL

// Get token from localStorage
const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// Signup
export const signup = async (data) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Login
export const login = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Start Session
export const startSession = async () => {
  const res = await fetch(`${API_URL}/sessions/start`, {
    method: "POST",
    headers: headers(),
  });
  return res.json();
};

// End session
export const endSession = async (sessionId) => {
  const res = await fetch(`${API_URL}/sessions/end/${sessionId}`, {
    method: "PUT",
    headers: headers(),
  });
  return res.json();
};

// Log violation
export const logViolation = async (data) => {
  try {
    console.log("Sending violation:", data);

    const res = await fetch(`${API_URL}/violations`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Violation API failed:", res.status, errorText);
      return { error: "Failed to log violation", status: res.status };
    }

    const json = await res.json();
    console.log("Violation API success:", json);
    return json;
  } catch (err) {
    console.error("Violation API error:", err);
    return { error: "Network or server error" };
  }
};

// Get all sessions (Admin)
export const getAllSessions = async () => {
  const res = await fetch(`${API_URL}/sessions/all`, {
    headers: headers(),
  });
  return res.json();
};

// Get single session (Admin)
export const getSessionById = async (id) => {
  const res = await fetch(`${API_URL}/sessions/${id}`, {
    headers: headers(),
  });
  return res.json();
};

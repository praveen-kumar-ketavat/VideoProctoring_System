import { useEffect, useState } from "react";
import { getAllSessions } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css"

function AdminDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await getAllSessions();
        setSessions(res);
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const openSession = (sessionId) => {
    navigate(`/reports/${sessionId}`);
  };

  return (
    <div className="container">
      <h1>📊 Admin Dashboard</h1>
      <h2>All Sessions</h2>

      {loading ? (
        <p>Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <ul className="session-list">
          {sessions.map((s) => (
            <li key={s._id} className="session-item">
              <span>
                <b>{s.candidateId?.name}</b> ({s.candidateId?.email}) —{" "}
                {new Date(s.startTime).toLocaleString()}
              </span>
              <button className="open-btn" onClick={() => openSession(s._id)}>
                Open
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminDashboard;

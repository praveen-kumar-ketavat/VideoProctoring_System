import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import InterviewPage from "./pages/InterviewPage";
import AdminDashboard from "./pages/AdminDashboard";
import ReportsPage from "./pages/ReportsPage";

function App() {
  const isLoggedIn = !!localStorage.getItem("token"); // 🔑 Always up-to-date

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected route */}
        <Route
          path="/interview"
          element={isLoggedIn ? <InterviewPage /> : <Navigate to="/login" />}
        />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/reports/:id" element={<ReportsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

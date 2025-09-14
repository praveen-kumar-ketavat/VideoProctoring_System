import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h1>👩‍💻 Video Detection Interview System</h1>
      <p>Please login or signup to continue.</p>

      <div style={{ marginTop: "2rem" }}>
        <Link to="/login">
          <button style={{ margin: "0 1rem", padding: "10px 20px" }}>Login</button>
        </Link>
        <Link to="/signup">
          <button style={{ margin: "0 1rem", padding: "10px 20px" }}>Signup</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;

import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <h2>Animal Sanctuary</h2>

      <div>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/animals" style={styles.link}>Animals</Link>
        <Link to="/approve" style={styles.link}>Approve</Link>
        <button onClick={handleLogout} style={styles.button}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 20px",
    background: "#222",
    color: "white",
  },
  link: {
    marginRight: "15px",
    color: "white",
    textDecoration: "none",
  },
  button: {
    padding: "5px 10px",
    cursor: "pointer",
  },
};
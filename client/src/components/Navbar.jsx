import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!localStorage.getItem("token")) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Placement Tracker</div>
      <div className="navbar-links">
        <NavLink to="/applications" className="nav-link">
          Applications
        </NavLink>
        <NavLink to="/experiences" className="nav-link">
          Experiences
        </NavLink>
        <NavLink to="/stats" className="nav-link">
          Stats
        </NavLink>
      </div>
      <div className="navbar-user">
        <span>{user?.username || user?.email}</span>
        <button className="btn btn-ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

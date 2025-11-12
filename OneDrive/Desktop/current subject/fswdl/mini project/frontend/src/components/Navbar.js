import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1 onClick={() => navigate("/dashboard")}>📈 Stock Market</h1>
      </div>

      <div className="navbar-links">
        <a href="/dashboard" className="nav-link">
          Dashboard
        </a>
        <a href="#ipo" className="nav-link">
          IPO Analysis
        </a>
      </div>

      <div className="navbar-user">
        <span className="user-name">
          {user?.firstName} {user?.lastName}
        </span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

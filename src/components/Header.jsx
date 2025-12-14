// Header.js
import { useState } from "react";
import { NavLink } from "react-router-dom";

import "../styles/header.css";


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Helper function for active link styling
  const getNavLinkClass = ({ isActive }) =>
    `navLink ${isActive ? "active" : ""}`;

  return (
    <header>
      <nav className="navbar">
        <h1 className="navbar-brand">LoL Player Search</h1>
        {/* Hamburger icon for mobile */}
        <div className="hamburger" onClick={toggleMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        {/* Nav links */}
        <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
          {/* Close button */}
          <div className="close-btn" onClick={toggleMenu}>
            ✕
          </div>
          <li>
            <NavLink
              to="/"
              className={getNavLinkClass}
              onClick={toggleMenu}
            >
              About Me
            </NavLink>
          </li>

        </ul>
      </nav>
    </header>
  );
}

export default Header;

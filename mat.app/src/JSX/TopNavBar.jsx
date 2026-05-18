import React from "react";
import { Link, useNavigate } from "react-router-dom";

function TopNavBar({ menuOpen, setMenuOpen, searchQuery, setSearchQuery }) {
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    navigate(`/menu?q=${encodeURIComponent(value)}`);
  };

  return (
    <div className="top-nav-bar">
      {/* Burger Menu */}
      <button
        className="nav-burger"
        onClick={() => setMenuOpen(true)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Logo/Brand Name */}
      <div className="nav-brand">
        <h1 className="brand-text">Ember and Oak</h1>
      </div>

      {/* Search and Profile */}
      <div className="nav-right">
        <input
          type="text"
          placeholder="Search..."
          className="nav-search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Link className="nav-profile" to="/account" title="Account" />
      </div>
    </div>
  );
}

export default TopNavBar;

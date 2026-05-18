import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from '../Images/hp-b.png';

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


        <img 
        src={Logo} 
        alt="logo" 
        style={{ 
          height: '90px', 
          width: '90px', 
          borderRadius: '100%', 
          justifyContent: "center"
          }} />

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

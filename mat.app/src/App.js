import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app">
      
      {/* Burger ikon */}
      <div className="burger" onClick={() => setMenuOpen(true)}>
        ☰
      </div>

      {/* Sök + profil */}
      <div className="top-right">
        <input type="text" placeholder="sök" className="search" />
        <div className="profile"></div>
      </div>

      {/* Hero content */}
      <div className="content text-center">
        <button className="btn btn-dark">beställ nu</button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="close-btn" onClick={() => setMenuOpen(false)}>
          ✕
        </div>

        <ul>
          <li>Startsida</li>
          <li>Galleri</li>
          <li>Om oss</li>
          <li>Meny</li>
          <li>Kundvagn</li>
          <li>Betalning</li>
        </ul>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)}></div>
      )}
    </div>
  );
}

export default App;
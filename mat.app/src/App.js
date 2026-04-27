
import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Gallery from "./Gallery";
import Menu from "./Menu";
import Cart from "./Cart";
import Payment from "./Payment";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function Sidebar({ menuOpen, setMenuOpen }) {
  const navigate = useNavigate();
  return (
    <div className={`sidebar ${menuOpen ? "open" : ""}`}>
      <div className="close-btn" onClick={() => setMenuOpen(false)}>
        ✕
      </div>
      <ul>
        <li><button onClick={() => {navigate("/"); setMenuOpen(false);}}>Startsida</button></li>
        <li><button onClick={() => {navigate("/gallery"); setMenuOpen(false);}}>Galleri</button></li>
        <li><button onClick={() => {navigate("/about"); setMenuOpen(false);}}>Om oss</button></li>
        <li><button onClick={() => {navigate("/menu"); setMenuOpen(false);}}>Meny</button></li>
        <li><button onClick={() => {navigate("/cart"); setMenuOpen(false);}}>Kundvagn</button></li>
        <li><button onClick={() => {navigate("/payment"); setMenuOpen(false);}}>Betalning</button></li>
      </ul>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  return (
    <Router>
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
        {/* Sidebar */}
        <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        {/* Overlay */}
        {menuOpen && (
          <div className="overlay" onClick={() => setMenuOpen(false)}></div>
        )}
        {/* Main content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;